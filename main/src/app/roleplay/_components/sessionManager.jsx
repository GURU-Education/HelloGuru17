// sessionManager.js
import { useState, useRef, useEffect } from "react";

export function useSessionManager(pronunciationAnalysisResult, selectedTopicData, selectedRole, startRecording, stopRecording, hskLevel, 
    convoTopic,
    conversationList) {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [events, setEvents] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);
    const peerConnection = useRef(null);
    const audioElement = useRef(null);

    useEffect(() => {
        const handlePronunciationResult = async () => {
        if (pronunciationAnalysisResult) {
            await startSession();
        }
        };
        handlePronunciationResult();
    }, [pronunciationAnalysisResult]);

    useEffect(() => {
        if (pronunciationAnalysisResult && dataChannel) {
        dataChannel.addEventListener("message", (e) => {
            setEvents((prev) => [JSON.parse(e.data), ...prev]);
        });

        dataChannel.addEventListener("open", () => {
            setIsSessionActive(true);
            setEvents([]);
            const feedbackPrompt = 
            "你是一位专业的中文老师，帮助一位母语为英语的学生提高普通话发音。\n\n" +
        
            "请分析以下发音数据，并提供**简明、实用**的反馈。你的反馈应包括：\n" +
            "- **指出错误**：列出学生发音不准确的字或音节。\n" +
            "- **正确示范**：用拼音和汉字展示正确发音，并附上简单的例句。\n" +
            "- **改进建议**：用简短中文解释口型、舌位或气流调整方法，必要时可用英语补充。\n\n" +
        
            "### 示例反馈：\n" +
            "- **误 (wù)**: 你读成了 *wǔ*，应该是 **wù**（四声）。🔹 例句：「我错了，是我的误会。」\n" +
            "  - **练习**：从高音开始，迅速降到低音，像感叹「哎呀」的语气。\n" +
            "- **吃 (chī)**: 你的舌头位置太靠后。🔹 例句：「我喜欢吃中国菜。」\n" +
            "  - **练习**：舌尖抵住上颚，轻轻送气，不要发成 *ts* 的音。\n\n" +
        
            "请确保你的反馈 **以中文为主，必要时少量英文解释**，使学生能直接理解和练习。\n\n" +
        
            "**以下是学生的发音分析数据：**\n\n" +
            "```json\n" + JSON.stringify(pronunciationAnalysisResult, null, 2) + "\n```";
            sendTextMessage(feedbackPrompt);
        });
        }
    }, [pronunciationAnalysisResult, dataChannel]);

    useEffect(() => {
        if (dataChannel && !pronunciationAnalysisResult) {
        dataChannel.addEventListener("message", (e) => {
            setEvents((prev) => [JSON.parse(e.data), ...prev]);
        });

        console.log("selected role is", selectedRole)

        dataChannel.addEventListener("open", () => {
            setIsSessionActive(true);
            setEvents([]);
            sendTextMessage(
            `We are role-playing. My role is ${selectedRole} and your role is the other one. 
            I will read the ${selectedRole}’s lines aloud, and you will read the other role lines aloud. Do not generate new text 
            outside of the given script below". 
            ${conversationList.join("\n")}
            "Do not respond until the user sends a message after session start. You always start with: "Let's start the conversation!". Then, if according to the conversation
            list you are supposed to talk first, then you talk first after saying Let's start the conversation! if according to the conversation list you are the second person to talk, then just say "Let's start the conversation!"
            and wait for user input
            `);
        });
        }
    }, [dataChannel]);

    async function startSession() {
        startRecording();
        const tokenResponse = await fetch("api/token");
        const data = await tokenResponse.json();
        const EPHEMERAL_KEY = data.client_secret.value;

        const pc = new RTCPeerConnection();

        audioElement.current = document.createElement("audio");
        audioElement.current.autoplay = true;
        audioElement.current.muted = false;
        audioElement.current.play().catch(error => console.error("Autoplay blocked:", error));

        pc.ontrack = (e) => {
        audioElement.current.srcObject = e.streams[0];
        };
        
        const ms = await navigator.mediaDevices.getUserMedia({
        audio: true,
        });
        
        pc.addTrack(ms.getTracks()[0]);

        const dc = pc.createDataChannel("oai-events");
        setDataChannel(dc);

        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);

        const baseUrl = "https://api.openai.com/v1/realtime";
        const model = "gpt-4o-realtime-preview-2024-12-17";
        const sdpResponse = await fetch(`${baseUrl}?model=${model}`, {
        method: "POST",
        body: offer.sdp,
        headers: {
            Authorization: `Bearer ${EPHEMERAL_KEY}`,
            "Content-Type": "application/sdp",
        },
        });

        const answer = {
        type: "answer",
        sdp: await sdpResponse.text(),
        };
        await pc.setRemoteDescription(answer);

        peerConnection.current = pc;
    }

    function stopSession() {
        stopRecording();
        if (dataChannel) {
        dataChannel.close();
        }

        peerConnection.current.getSenders().forEach((sender) => {
        if (sender.track) {
            sender.track.stop();
        }
        });

        if (peerConnection.current) {
        peerConnection.current.close();
        }

        setIsSessionActive(false);
        setDataChannel(null);
        peerConnection.current = null;
    }

    function sendClientEvent(message) {
        if (dataChannel) {
        message.event_id = message.event_id || crypto.randomUUID();
        dataChannel.send(JSON.stringify(message));
        setEvents((prev) => [message, ...prev]);
        } else {
        console.error(
            "Failed to send message - no data channel available",
            message,
        );
        }
    }

    function sendTextMessage(message) {
        const event = {
        type: "conversation.item.create",
        item: {
            type: "message",
            role: "user",
            content: [
            {
                type: "input_text",
                text: message,
            },
            ],
        },
        };

        sendClientEvent(event);
        sendClientEvent({ type: "response.create" });
    }

    return { startSession, stopSession, isSessionActive };
}