import mongoose from "mongoose";
import Conversation from "../../../../models/Conversation";
import connectToDatabase from "../../../../lib/mongodb";

export async function POST(req) {
  try {
    await connectToDatabase();

    const conversations = await Conversation.find();

    for (let convo of conversations) {
      convo.conversation = convo.conversation.map((line) => {
        const updatedLine = line.replace(/^Person 1:/, '小丽:').replace(/^Person 2:/, '小刚:');
        return updatedLine;
      });
      
      await convo.save();
    }
    return new Response(JSON.stringify({ message: "Conversations updated successfully" }), { 
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
  } catch (error) {
    console.error("Error updating conversations:", error);
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { "Content-Type": "application/json" }
    });
  }
}
