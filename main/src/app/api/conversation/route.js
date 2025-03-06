import connectToDatabase from "../../../../lib/mongodb";
import conversations from "../../../../models/Conversation";

export async function GET(req) {
  try {
    await connectToDatabase();
    const conversationObjects = await conversations.find();
    // console.log(conversationObjects);
    return Response.json({ success: true, conversationObjects });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
