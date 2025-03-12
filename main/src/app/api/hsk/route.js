import connectToDatabase from "../../../../lib/mongodb";
import HSK from "../../../../models/HSK";

export async function GET(req) {
  try {
    await connectToDatabase();
    const hskItems = await HSK.find();
    return Response.json({ success: true, hskItems });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
