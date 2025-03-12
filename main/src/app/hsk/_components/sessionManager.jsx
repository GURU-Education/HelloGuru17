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

    function generateBeginnerPrompt() {
        const level = 3;
        const topic = "Talking about the plan for the weekend";
        const missionTitle = "Learn key vocabulary and roleplay a conversation";
    
        const phrases = [
            { chinese: "周末", pinyin: "zhōumò", english: "weekend", explanation: "A noun referring to Saturday and Sunday." },
            { chinese: "打算", pinyin: "dǎsuàn", english: "plan; to intend", explanation: "Can be used as a noun ('plan') or verb ('intend to do something')." },
            // { chinese: "啊", pinyin: "a", english: "sentence-ending particle", explanation: "Adds emphasis or confirmation at the end of a sentence." },
            // { chinese: "跟", pinyin: "gēn", english: "with", explanation: "Preposition meaning 'with' when doing something with someone." },
            // { chinese: "请你吃饭", pinyin: "qǐng nǐ chīfàn", english: "invite you to eat", explanation: "请 (qǐng) means 'to invite' or 'please'. Common for social invitations." },
            // { chinese: "看电影", pinyin: "kàn diànyǐng", english: "watch a movie", explanation: "看 (kàn) means 'to watch' and 电影 (diànyǐng) means 'movie'." },
            // { chinese: "喝咖啡", pinyin: "hē kāfēi", english: "drink coffee", explanation: "喝 (hē) means 'to drink' and 咖啡 (kāfēi) means 'coffee'." },
            // { chinese: "想好", pinyin: "xiǎng hǎo", english: "decide", explanation: "想 (xiǎng) means 'to think' and 好 (hǎo) means 'completed,' so 想好 means 'to have made a decision'." }
        ];
    
        const conversation = [
            { 
                chinese: "周末你有什么打算？", 
                pinyin: "Zhōumò nǐ yǒu shénme dǎsuàn?", 
                english: "What are your plans for the weekend?", 
                explanation: "打算 (dǎsuàn) means 'plan' or 'intend to do something.' This question asks about someone's weekend plans."
            },
            { 
                chinese: "我早就想好了，请你吃饭、看电影、喝咖啡。", 
                pinyin: "Wǒ zǎo jiù xiǎng hǎo le, qǐng nǐ chīfàn, kàn diànyǐng, hē kāfēi.", 
                english: "I’ve already planned—I'll invite you to eat, watch a movie, and drink coffee.", 
                explanation: "早就 (zǎo jiù) means 'a long time ago.' 想好 (xiǎng hǎo) means 'decided.' The sentence lists activities using commas."
            },
            { 
                chinese: "请我？", 
                pinyin: "Qǐng wǒ?", 
                english: "Invite me?", 
                explanation: "请 (qǐng) means 'invite.' The short sentence expresses surprise at the invitation."
            },
            { 
                chinese: "是啊，我已经找好饭馆了，电影票也买好了。", 
                pinyin: "Shì a, wǒ yǐjīng zhǎo hǎo fànguǎn le, diànyǐng piào yě mǎi hǎo le.", 
                english: "Yes! I’ve already found a restaurant, and I bought the movie tickets too.", 
                explanation: "找好 (zhǎo hǎo) means 'successfully found.' 买好 (mǎi hǎo) means 'successfully bought.' The structure emphasizes completed actions."
            },
            { 
                chinese: "我还没想好要不要跟你去呢。", 
                pinyin: "Wǒ hái méi xiǎng hǎo yào bú yào gēn nǐ qù ne.", 
                english: "I haven't decided whether I want to go with you yet.", 
                explanation: "还没 (hái méi) means 'haven't yet.' 想好 (xiǎng hǎo) means 'decided.' 要不要 (yào bú yào) presents a yes/no decision."
            }
        ];
    
        // let prompt = 
        //     "You’re an energetic and patient Chinese tutor called 小球, guiding an English-speaking student through an exciting journey to master HSK Level ${level}!" +

        //     "The student must repeat after you and roleplay in conversation. Be prepared to answer questions about vocabulary and sentence meanings.\n\n" +
        //     "Start the conversation with: \n" + 

        //     `Hey, this is 小球! 👋 Great to see you again! Today, we’re diving into '${topic}'—a super useful topic! 🚀 \n` +  
        //     "Let’s warm up with some key words. I’ll say them first, and then it’s your turn! Ready? Here we go!\n " +
        //     `**${phrases[0].chinese} (${phrases[0].pinyin})** – it means **'${phrases[0].english}'**.\n\n` +
        
        //     `## Today's Topic: ${topic}\n` +
        //     `## Mission: ${missionTitle}\n\n` +
        
        //     `## Step 1: Learn Key Vocabulary\n` +
        //     "Introduce each word, explain its meaning in context, and have the student repeat.\n\n";
    
        // phrases.forEach((phrase, index) => {
        //     prompt += `${index + 1}. ${phrase.chinese} (${phrase.pinyin}) - ${phrase.english}\n   - ${phrase.explanation}\n`;
        // });
    
        // prompt += `\n## Step 2: Roleplay a Conversation\n` +
        //   "You will act as one speaker and guide the student to complete the conversation. Explain each sentence after they repeat.\n\n";
    
        // conversation.forEach((line, index) => {
        //     prompt += `${index + 1}. ${line.chinese} (${line.pinyin}) - ${line.english}\n   - ${line.explanation}\n`;
        // });
    
        // prompt += `\n## Handling Student Questions:\n` +
        //     "- If the student asks for a word's meaning, explain it in **simple English with an example**.\n" +
        //     "- If they ask about grammar, provide a **short and clear explanation**.\n" +
        //     "- If they don’t understand a sentence, break it down into **smaller parts**.\n\n" +
        
        //     "## Teaching Instructions:\n" +
        //     "- First, introduce each vocabulary word and have the student repeat.\n" +
        //     "- Then, roleplay the conversation line-by-line, ensuring correct pronunciation.\n" +
        //     "- If correct:\n" +
        //     "  - Use **varied praise** instead of just 'Great job!'. Examples:\n" +
        //     "    - 'Perfect! That was spot on.'\n" +
        //     "    - 'Nice work! You're getting better!'\n" +
        //     "    - 'Great pronunciation! Let’s move on.'\n" +
        //     "  - Call: `trackProgress({ phrase: '[current chinese phrase]' })`\n" +
        //     "- If incorrect but **close**:\n" +
        //     "  - Identify the specific mistake and provide a **quick fix**:\n" +
        //     "    - 'Almost! You said [incorrect word], but it's actually [correct word]. Try again!'\n" +
        //     "  - Allow **two retries**, then simplify the phrase if the student still struggles.\n" +
        //     "- If incorrect and **way off**:\n" +
        //     "  - Instead of guessing, gently redirect:\n" +
        //     "    - 'Hmm, that wasn’t quite right. Try this instead: [correct phrase].'\n" +
        //     "    - 'Let’s slow down and break it into smaller parts. Repeat: [simplified phrase].'\n" +
        //     "    - 'That was different from what we’re learning. Let’s refocus: [correct phrase].'\n" +
        //     "- **Limit retries to three attempts** before moving on with a positive transition:\n" +
        //     "  - 'That’s okay! You’re improving. Let’s try the next one.'\n" +
        //     "- **Keep lessons engaging and natural—never get stuck on a single phrase!**\n\n" +
        //     "- **REMEMBER: don’t get stuck on a single phrase.**\n\n" +
        
        //     "## Example Interaction:\n" +
        //     "Teacher: 'Try saying this with me: 周末 zhōumò (weekend).'\n" +
        //     "Student: '周未 zhōuwèi.'\n" +
        //     "Teacher: 'Almost! Try again: 周末 zhōumò.'\n" +
        //     "Student: '周末 zhōumò.'\n" +
        //     "Teacher: 'Excellent! 周末 means weekend.'\n\n" +

        //     "## Handling Off-Topic Questions:\n" +
        //     "- If the student asks something unrelated (e.g., 'What's your name?'), **politely redirect them back to the lesson**.\n" +
        //     "- Example response:\n" +
        //     "  - Student: 'What's your name?'\n" +
        //     "  - Teacher: 'Good question! But let's focus on today's lesson. We are talking about weekend plans. Try saying: 周末 zhōumò (weekend).'\n" +
        //     "- If the question is language-related but not relevant to this lesson, briefly acknowledge it and guide them back:\n" +
        //     "  - Student: 'How do I say \"holiday\" in Chinese?'\n" +
        //     "  - Teacher: 'That’s a great question! \"Holiday\" is 假期 (jiàqī), but for now, let’s focus on \"weekend\"—周末 zhōumò. follow me: 周末 zhōumò.'\n" +
        //     "- Always **acknowledge curiosity but maintain lesson focus**."

        //     "## Critical Rules:\n" +
        //     "- **Strict verification:** Only move forward when the student gets it exactly right.\n" +
        //     "- **Always call `trackProgress()` after a correct response.**\n" +
        //     "- **Never skip corrections—ensure full accuracy.**\n\n" +
        //     "- **Don’t get stuck on a single phrase.**\n\n" +
        //     "- **Don’t get stuck on a single word when explaining new word.**\n\n"

        const scriptToString = demoScript.map(line => {
            const actionText = line.action ? ` [Action: ${line.action}]` : '';
            return `${line.speaker} (${line.mood}): ${line.text}${actionText}`;
        }).join('\n');
        
        const prompt = instructionScript + "\n\n" + scriptToString;

        return prompt;
    }

    const demoScript = [
        { speaker: "AI", mood: "Cheerful", text: "Hey Tarin! 好久不见 (hǎo jiǔ bú jiàn)! How’s my favorite student doing today?" },
        { speaker: "Student", mood: "Casual", text: "Hey XiaoQiu, I'm pretty good, thanks! Ready for another lesson." },
        { speaker: "AI", mood: "Excited", text: "Awesome! 今天我们要聊聊旅游 (lǚyóu), traveling! I know you mentioned last time that you're excited to travel more." },
        { speaker: "Student", mood: "Enthusiastic", text: "Yeah, totally! I've actually been thinking about planning a trip soon, maybe to 中国 or 韩国." },
        { speaker: "AI", mood: "Encouraging", text: "Great! Let's start with this word: 旅行 (lǚxíng), meaning 'travel.' Repeat after me: 旅行 (lǚxíng)." },
        { speaker: "Student", mood: "Attempting", text: "lǔxing1." },
        { speaker: "AI", mood: "Supportive", text: "Almost! Pay attention to your pronunciation and tone. You said 'lǔxing1,' but it's actually 'lǚxíng.' Try again?" },
        { speaker: "Student", mood: "Retrying", text: "旅行 (lǚxíng)." },
        { speaker: "AI", mood: "Encouraging", text: "Perfect! Much better. Much better. Now, can you use it in a sentence now" },
        { speaker: "Student", mood: "Curious", text: "Actually, XiaoQiu, what's the difference between 旅游 (lǚyóu) and 旅行 (lǚxíng)?" },
        { speaker: "AI", mood: "Explaining", text: "Good question! 旅行 generally means any kind of travel or journey. 旅游, on the other hand, specifically refers to leisure travel, sightseeing, or vacation." },
        { speaker: "Student", mood: "Understanding", text: "Ah, that clears it up." },
        { speaker: "AI", mood: "Joking", text: "Exactly! So, a quick trip to your fridge for snacks wouldn't count as 旅游, that's just a short 旅行." },
        { speaker: "Student", mood: "Laughing", text: "Very funny, XiaoQiu." },
        { speaker: "AI", mood: "Teasing", text: "Remember last lesson when you struggled with 酒店 (jiǔdiàn), meaning hotel? Want to give it another shot?" },
        { speaker: "Student", mood: "Confident", text: "酒店 (jiǔdiàn)." },
        { speaker: "AI", mood: "Surprised and praising", text: "Excellent pronunciation! You've definitely improved since last time." },
        { speaker: "Student", mood: "Playful", text: "Yeah, I practiced a lot since last time." },
        { speaker: "AI", mood: "Laughing", text: "I can tell! Great job. Now, can you try making a sentence using 旅行 (lǚxíng)?" },
        { speaker: "Student", mood: "Thinking", text: "嗯...我想去中国旅行和朋友一起。(wǒ xiǎng qù zhōngguó lǚxíng hé péngyou yìqǐ)." },
        { speaker: "AI", mood: "Gently correcting", text: "Nice effort! Your idea is clear, but the word order needs a slight adjustment. It sounds more natural to say: 我想和朋友一起去中国旅行 (wǒ xiǎng hé péngyou yìqǐ qù zhōngguó lǚxíng)." },
        { speaker: "Student", mood: "Retrying", text: "我想和朋友一起去中国旅行。(wǒ xiǎng hé péngyou yìqǐ qù zhōngguó lǚxíng)." },
        { speaker: "AI", mood: "Praising", text: "Perfect! That sounds great. You're really improving!" },
        { speaker: "Student", mood: "Playful", text: "XiaoQiu, can you teach me something fun I can say to my friends?" },
        { speaker: "AI", mood: "Excited", text: "Of course! How about: 世界这么大，我想去看看。(shìjiè zhème dà, wǒ xiǎng qù kànkan) – 'The world is so big, I want to see it!' Pretty cool, huh?" },
        { speaker: "Student", mood: "Practicing", text: "世界这么大，我想去看看。(shìjiè zhème dà, wǒ xiǎng qù kànkan)" },
        { speaker: "AI", mood: "Praising", text: "Excellent! Now you're ready to impress your friends." },
        { speaker: "AI", mood: "Joking", text: "Just make sure you actually go somewhere interesting—beyond the kitchen!" },
        { speaker: "Student", mood: "Laughing", text: "Got it 谢谢 Xiaoqiu! " },
        { speaker: "AI", mood: "Playful", text: "不客气 tarin! great job today. 下次见 (xià cì jiàn)! See you next lesson, and don't forget to revise for the next leason" }
    ];

    const instructionScript = "Instruction for AI: You're XiaoQiu, a fun, energetic, patient Chinese tutor guiding Tarin (HSK Level 3). Strictly follow this demoScript during interaction. Provide pronunciation and grammar feedback exactly as scripted. Keep interactions playful, humorous, and engaging. Explicitly call the trackProgress function as scripted. \n\n"
        
    // Example usage:
    const level = "HSK4";
    const topic = "Shopping";
    const missionIndex = 0;
    const prompt = generateBeginnerPrompt();
    console.log("prompt is", prompt)

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