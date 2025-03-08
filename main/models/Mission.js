import mongoose from "mongoose";

const Schema = mongoose.Schema;

const phraseSchema = new Schema({
  chinese: String,
  pinyin: String,
  english: String,
});

const missionSchema = new Schema({
  missionTitle: String,
  phrases: [phraseSchema],
});

const topicSchema = new Schema({
  Restaurant: [missionSchema],
});

const hskSchema = new Schema({
  topics: topicSchema,
});

const missionModelSchema = new Schema({
  _id: Schema.Types.ObjectId,
  HSK1: hskSchema,
});

export default mongoose.models.Mission ||
  mongoose.model("Mission", missionModelSchema);
