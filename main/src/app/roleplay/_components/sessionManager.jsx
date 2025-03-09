// sessionManager.js
import { useState, useRef, useEffect } from "react";

const chineseLearningContent = {
    HSK1: {
        topics: {
            Restaurant: [
            {
                missionTitle: "Ordering Food",
                phrases: [
                { chinese: "你好", pinyin: "nǐ hǎo", english: "Hello" },
                { chinese: "米饭", pinyin: "mǐfàn", english: "Rice" },
                { chinese: "鸡肉", pinyin: "jīròu", english: "Chicken" },
                { chinese: "茶", pinyin: "chá", english: "Tea" },
                ],
            },
            ],
        },
    },

    HSK2: {
        topics: {
            Restaurant: [
                {
                    missionTitle: "Asking for the Menu",
                    phrases: [
                        { chinese: "菜单", pinyin: "càidān", english: "Menu" },
                        { chinese: "请", pinyin: "qǐng", english: "Please" },
                        { chinese: "这个", pinyin: "zhège", english: "This" },
                        { chinese: "好吃", pinyin: "hǎochī", english: "Delicious" },
                    ],
                },
            ],
            Travel: [
                {
                    missionTitle: "Buying a Ticket",
                    phrases: [
                        { chinese: "票", pinyin: "piào", english: "Ticket" },
                        { chinese: "去", pinyin: "qù", english: "Go to" },
                        { chinese: "火车", pinyin: "huǒchē", english: "Train" },
                        { chinese: "现在", pinyin: "xiànzài", english: "Now" },
                    ],
                },
            ],
            Weather: [
                {
                    missionTitle: "Talking About Weather",
                    phrases: [
                        { chinese: "天气", pinyin: "tiānqì", english: "Weather" },
                        { chinese: "今天", pinyin: "jīntiān", english: "Today" },
                        { chinese: "冷", pinyin: "lěng", english: "Cold" },
                        { chinese: "热", pinyin: "rè", english: "Hot" },
                    ],
                },
            ],
            Shopping: [
                {
                    missionTitle: "Bargaining",
                    phrases: [
                        { chinese: "太贵", pinyin: "tài guì", english: "Too expensive" },
                        { chinese: "便宜", pinyin: "piányi", english: "Cheap" },
                        { chinese: "可以", pinyin: "kěyǐ", english: "Can/Okay" },
                        { chinese: "那个", pinyin: "nàge", english: "That" },
                    ],
                },
            ],
            Time: [
                {
                    missionTitle: "Asking the Time",
                    phrases: [
                        { chinese: "几点", pinyin: "jǐ diǎn", english: "What time?" },
                        { chinese: "早上", pinyin: "zǎoshang", english: "Morning" },
                        { chinese: "下午", pinyin: "xiàwǔ", english: "Afternoon" },
                        { chinese: "晚上", pinyin: "wǎnshang", english: "Evening" },
                    ],
                },
            ],
        },
    },

    HSK3: {
        topics: {
            Restaurant: [
                {
                    missionTitle: "Making a Reservation",
                    phrases: [
                        { chinese: "订位", pinyin: "dìng wèi", english: "Reserve a seat" },
                        { chinese: "明天", pinyin: "míngtiān", english: "Tomorrow" },
                        { chinese: "几个人", pinyin: "jǐ gè rén", english: "How many people?" },
                        { chinese: "知道", pinyin: "zhīdào", english: "Know" },
                    ],
                },
            ],
            Directions: [
                {
                    missionTitle: "Finding the Way",
                    phrases: [
                        { chinese: "怎么走", pinyin: "zěnme zǒu", english: "How to go?" },
                        { chinese: "左边", pinyin: "zuǒbiān", english: "Left" },
                        { chinese: "右边", pinyin: "yòubiān", english: "Right" },
                        { chinese: "直走", pinyin: "zhí zǒu", english: "Go straight" },
                    ],
                },
            ],
            Health: [
                {
                    missionTitle: "Visiting a Doctor",
                    phrases: [
                        { chinese: "医生", pinyin: "yīshēng", english: "Doctor" },
                        { chinese: "不舒服", pinyin: "bù shūfu", english: "Not feeling well" },
                        { chinese: "头疼", pinyin: "tóuténg", english: "Headache" },
                        { chinese: "药", pinyin: "yào", english: "Medicine" },
                    ],
                },
            ],
            School: [
                {
                    missionTitle: "Talking About Classes",
                    phrases: [
                        { chinese: "学校", pinyin: "xuéxiào", english: "School" },
                        { chinese: "上课", pinyin: "shàng kè", english: "Attend class" },
                        { chinese: "老师", pinyin: "lǎoshī", english: "Teacher" },
                        { chinese: "喜欢", pinyin: "xǐhuān", english: "Like" },
                    ],
                },
            ],
            Hobbies: [
                {
                    missionTitle: "Sharing Interests",
                    phrases: [
                        { chinese: "运动", pinyin: "yùndòng", english: "Sports" },
                        { chinese: "看书", pinyin: "kàn shū", english: "Read books" },
                        { chinese: "有时候", pinyin: "yǒushíhou", english: "Sometimes" },
                        { chinese: "一起", pinyin: "yīqǐ", english: "Together" },
                    ],
                },
            ],
        },
    },

    HSK4: {
        topics: {
            Restaurant: [
                {
                    missionTitle: "Complaining About Food",
                    phrases: [
                        { chinese: "服务", pinyin: "fúwù", english: "Service" },
                        { chinese: "不好", pinyin: "bù hǎo", english: "Not good" },
                        { chinese: "因为", pinyin: "yīnwèi", english: "Because" },
                        { chinese: "慢", pinyin: "màn", english: "Slow" },
                    ],
                },
            ],
            Travel: [
                {
                    missionTitle: "Planning a Trip",
                    phrases: [
                        { chinese: "旅行", pinyin: "lǚxíng", english: "Travel" },
                        { chinese: "准备", pinyin: "zhǔnbèi", english: "Prepare" },
                        { chinese: "行李", pinyin: "xíngli", english: "Luggage" },
                        { chinese: "需要", pinyin: "xūyào", english: "Need" },
                    ],
                },
            ],
            Work: [
                {
                    missionTitle: "Discussing a Job",
                    phrases: [
                        { chinese: "工作", pinyin: "gōngzuò", english: "Work/Job" },
                        { chinese: "公司", pinyin: "gōngsī", english: "Company" },
                        { chinese: "忙", pinyin: "máng", english: "Busy" },
                        { chinese: "休息", pinyin: "xiūxi", english: "Rest" },
                    ],
                },
            ],
            Shopping: [
                {
                    missionTitle: "Returning an Item",
                    phrases: [
                        { chinese: "退货", pinyin: "tuì huò", english: "Return goods" },
                        { chinese: "问题", pinyin: "wèntí", english: "Problem" },
                        { chinese: "换", pinyin: "huàn", english: "Exchange" },
                        { chinese: "不好意思", pinyin: "bù hǎoyìsi", english: "Sorry/Excuse me" },
                    ],
                },
            ],
            Feelings: [
                {
                    missionTitle: "Expressing Emotions",
                    phrases: [
                        { chinese: "高兴", pinyin: "gāoxìng", english: "Happy" },
                        { chinese: "担心", pinyin: "dānxīn", english: "Worry" },
                        { chinese: "虽然", pinyin: "suīrán", english: "Although" },
                        { chinese: "但是", pinyin: "dànshì", english: "But" },
                    ],
                },
            ],
        },
    }
}


export function useSessionManager(pronunciationAnalysisResult, selectedTopicData, selectedRole, startRecording, stopRecording, hskLevel, 
    convoTopic,
    conversationList) {
    const [isSessionActive, setIsSessionActive] = useState(false);
    const [events, setEvents] = useState([]);
    const [dataChannel, setDataChannel] = useState(null);
    const [completedPhrases, setCompletedPhrases] = useState([]);
    const peerConnection = useRef(null);
    const audioElement = useRef(null);
    const [mission, setMission] = useState(null);
    const [missionPhrases, setMissionPhrases] = useState([]);

    useEffect(() => {
        const handlePronunciationResult = async () => {
        if (pronunciationAnalysisResult) {
            await startSession();
        }
        };
        handlePronunciationResult();
    }, [pronunciationAnalysisResult]);

    useEffect(() => {
        if (chineseLearningContent["HSK3"] && chineseLearningContent["HSK3"].topics["Restaurant"]) {
            const newMission = chineseLearningContent["HSK3"].topics["Restaurant"][0];
            setMission(newMission);
            setMissionPhrases(newMission.phrases.map((p) => p.chinese));
        }
    }, [mission])

    const fns = {
        trackProgress: ({ phrase }) => {
            if (!completedPhrases.includes(phrase)) {
                setCompletedPhrases((prev) => [...prev, phrase]);
            }
            return { success: true, phrase };
        },
    };

    function configureData() {
        console.log('Configuring data channel');
        const event = {
            type: 'session.update',
            session: {
                modalities: ['text', 'audio'],
                tools: [
                    {
                        type: 'function',
                        name: 'trackProgress',
                        description: 'Tracks progress of the mission by marking a phrase as completed',
                        parameters: {
                            type: 'object',
                            properties: {
                                phrase: { type: 'string', description: 'The Chinese phrase the student correctly repeated' },
                            },
                            required: ['phrase'],
                        },
                    },
                ],
            },
        };
        dataChannel.send(JSON.stringify(event));
    }

    function generateBeginnerPrompt(level, topic, missionIndex) {
        const mission = chineseLearningContent[level].topics[topic][missionIndex];
        const phrases = mission.phrases;
      
        let prompt =
          `You are a strict yet supportive Chinese teacher for an absolute beginner (HSK Level ${level}). ` +
          `The student speaks only English and learns by repeating after you.\n\n` +
          `## Today's Topic: ${topic}\n` +
          `## Mission: ${mission.missionTitle}\n\n` +
          `## Phrases to Teach:\n`;
    
        phrases.forEach((phrase, index) => {
            prompt += `${index + 1}. ${phrase.chinese} (${phrase.pinyin}) - ${phrase.english}\n`;
        });
    
        prompt += `\n## Teaching Instructions:\n` +
          "- Clearly introduce each phrase with correct pronunciation and word order.\n" +
          "- After the student repeats, strictly verify their response word-by-word.\n" +
          "- If correct:\n" +
          "  - Say: 'Great job!'\n" +
          "  - Call: `trackProgress({ phrase: '[current chinese phrase]' })`\n" +
          "  - Move to the next phrase.\n" +
          "- If incorrect but **similar** (minor pronunciation or word order mistake):\n" +
          "  - Point out exactly what was wrong.\n" +
          "  - State the correct phrase and ask them to repeat.\n" +
          "  - Keep retrying until they get it right.\n" +
          "- If the student says something **very different** (not close to the expected phrase):\n" +
          "  - Do **not** try to interpret or guess their meaning.\n" +
          "  - Simply say: 'I didn't understand that. Let's try again: [correct phrase].'\n";
          
          "## Example Interaction:\n" +
          "Teacher: 'Repeat after me: 米饭 mǐfàn (rice).'\n" +
          "Student: '饭米 fànmǐ.'\n" +
          "Teacher: 'Almost! You said 饭米 fànmǐ, but the correct way is 米饭 mǐfàn. Try again: 米饭 mǐfàn.'\n" +
          "Student: '米饭 mǐfàn.'\n" +
          "Teacher: 'Excellent! 米饭 means rice. Well done!'\n\n" +
    
          "## Critical Rules:\n" +
          "- **Strict verification:** Only say 'Great job!' when the student’s pronunciation and word order are **exactly correct**.\n" +
          "- **Always call `trackProgress` after correct pronunciation.**\n" +
          "- **Do not move to the next phrase until the current one is correct.**\n\n" +
    
          `Now, greet the student and start: 'Hello! Let's practice simple Chinese. Repeat after me: ${phrases[0].chinese} ${phrases[0].pinyin}.'\n`;
    
        return prompt;
    }
    
    // Example usage:
    const level = "HSK4";
    const topic = "Shopping";
    const missionIndex = 0;
    const prompt = generateBeginnerPrompt(level, topic, missionIndex);

    useEffect(() => {
        if (pronunciationAnalysisResult && dataChannel) {
            dataChannel.addEventListener("message", (e) => {
                setEvents((prev) => [JSON.parse(e.data), ...prev]);
            });

            dataChannel.addEventListener("open", () => {
                setIsSessionActive(true);
                setEvents([]);
                // const feedbackPrompt = 
                // "你是一位专业的中文老师，帮助一位母语为英语的学生提高普通话发音。\n\n" +
            
                // "请分析以下发音数据，并提供**简明、实用**的反馈。你的反馈应包括：\n" +
                // "- **指出错误**：列出学生发音不准确的字或音节。\n" +
                // "- **正确示范**：用拼音和汉字展示正确发音，并附上简单的例句。\n" +
                // "- **改进建议**：用简短中文解释口型、舌位或气流调整方法，必要时可用英语补充。\n\n" +
            
                // "### 示例反馈：\n" +
                // "- **误 (wù)**: 你读成了 *wǔ*，应该是 **wù**（四声）。🔹 例句：「我错了，是我的误会。」\n" +
                // "  - **练习**：从高音开始，迅速降到低音，像感叹「哎呀」的语气。\n" +
                // "- **吃 (chī)**: 你的舌头位置太靠后。🔹 例句：「我喜欢吃中国菜。」\n" +
                // "  - **练习**：舌尖抵住上颚，轻轻送气，不要发成 *ts* 的音。\n\n" +
            
                // "请确保你的反馈 **以中文为主，必要时少量英文解释**，使学生能直接理解和练习。\n\n" +
            
                // "**以下是学生的发音分析数据：**\n\n" +
                // "```json\n" + JSON.stringify(pronunciationAnalysisResult, null, 2) + "\n```";
                // sendTextMessage(feedbackPrompt);
            });
        }
    }, [pronunciationAnalysisResult, dataChannel]);

    useEffect(() => {
        if (dataChannel && !pronunciationAnalysisResult) {
            dataChannel.addEventListener("message", (e) => {
            const event = JSON.parse(e.data);
            setEvents((prev) => [JSON.parse(e.data), ...prev]);
            if (event.type === "response.function_call_arguments.done" && event.name === "trackProgress") {
                const args = JSON.parse(event.arguments);
                const fn = fns[event.name];
                console.log("finding function")
                if (fn) {
                    console.log("calling function")
                    const result = fn(args);
                    sendClientEvent({
                        type: "conversation.item.create",
                        item: {
                            type: "function_call_output",
                            call_id: event.call_id,
                            output: JSON.stringify(result),
                        },
                    });
                    sendClientEvent({ type: "response.create" });
                }
            }
        });

        console.log("selected role is", selectedRole)

        dataChannel.addEventListener("open", () => {
            configureData();
            setIsSessionActive(true);
            setEvents([]);
            setCompletedPhrases([]);
            sendTextMessage(prompt);
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

        setCompletedPhrases([]);
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

    return { startSession, stopSession, isSessionActive, completedPhrases, missionPhrases };
}