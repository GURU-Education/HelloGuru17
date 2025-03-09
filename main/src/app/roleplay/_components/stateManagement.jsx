// stateManagement.js
import { useState, useRef, useEffect } from "react";

export function useStateManagement() {
    const [hskLevels, setHskLevels] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [dialogueIndex, setDialogueIndex] = useState(0);
    const [pronunciationAnalysisResult, setPronunciationAnalysisResult] = useState(null);
    const [completedPhrases, setCompletedPhrases] = useState([]);
    
    const chatBoxRef = useRef(null);

    const selectedHSK = hskLevels?.find((hsk) => hsk.level === selectedLevel);
    const selectedTopicData = selectedHSK?.topics.find((t) => t.name === selectedTopic);

    useEffect(() => {
        async function fetchConversations() {
        try {
            const res = await fetch("/api/conversation");
            const data = await res.json();
            setConversations(data.conversationObjects);
        } catch (error) {}
        }
        fetchConversations();
    }, []);

    useEffect(() => {
        const mappedData = conversations.reduce((acc, doc) => {
        let levelObj = acc.find((item) => item.level === doc.hskLevel);
        if (!levelObj) {
            levelObj = { level: doc.hskLevel, topics: [] };
            acc.push(levelObj);
        }
        const hasTopic = levelObj.topics.some((t) => t.name === doc.topic);
        if (!hasTopic) {
            levelObj.topics.push({
            name: doc.topic,
            conversation: doc.conversation,
            });
        }
        return acc;
        }, []);
        setHskLevels(mappedData);
    }, [conversations]);

    useEffect(() => {
        if (chatBoxRef.current) {
        chatBoxRef.current.scrollTo({
            top: chatBoxRef.current.scrollHeight,
            behavior: "smooth",
        });
        }
    }, [dialogueIndex]);

    const handleSelectTopic = (topic) => {
        setSelectedTopic(topic);
        const topicData = selectedHSK?.topics.find((t) => t.name === topic);
        setSelectedConversation(topicData?.conversation || null);
        setCompletedPhrases([]);
        setDialogueIndex(0);
    };


    const handleReset = () => {
        setSelectedLevel(null);
        setSelectedTopic(null);
        setSelectedRole(null);
        setSelectedConversation(null);
        setDialogueIndex(0);
    };

    return {
        hskLevels,
        selectedLevel,
        setSelectedLevel,
        selectedTopic,
        setSelectedTopic: handleSelectTopic,
        selectedConversation,
        selectedRole,
        setSelectedRole,
        dialogueIndex,
        setDialogueIndex,
        chatBoxRef,
        selectedHSK,
        selectedTopicData,
        handleReset,
        pronunciationAnalysisResult,
        setPronunciationAnalysisResult,
        completedPhrases,
        setCompletedPhrases,
    };
}