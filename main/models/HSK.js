// {"_id":{"$oid":"67d199b33bfaa3fd8d88c1e1"},"HSK1":{"topics":[{"Daily Greetings":{"newWords":[{"chinese":"你好","pinyin":"nǐ hǎo","english":"Hello"},{"chinese":"谢谢","pinyin":"xièxiè","english":"Thank you"}],"conversation":[{"chinese":"你好！你好吗？","pinyin":"Nǐ hǎo! Nǐ hǎo ma?","english":"Hello! How are you?"},{"chinese":"我很好，谢谢！","pinyin":"Wǒ hěn hǎo, xièxiè!","english":"I'm good, thank you!"}]}}]}}
import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Define the phrase schema
const phraseSchema = new Schema({
  chinese: { type: String, required: true },
  pinyin: { type: String, required: true },
  english: { type: String, required: true },
});

// Define the conversation schema
const conversationSchema = new Schema({
  chinese: { type: String, required: true },
  pinyin: { type: String, required: true },
  english: { type: String, required: true },
});

// Define the topic schema
const topicSchema = new Schema({
  newWords: [phraseSchema],
  conversation: [conversationSchema],
});

// Define the HSK schema
const hskSchema = new Schema({
  topics: {
    type: Map,
    of: topicSchema,
  },
});

// Define the mission model schema
const missionModelSchema = new Schema({
  _id: Schema.Types.ObjectId,
  HSK1: hskSchema,
});

// Export the model
export default mongoose.models.Mission ||
  mongoose.model("Mission", missionModelSchema);
