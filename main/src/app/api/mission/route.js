import connectToDatabase from "../../../../lib/mongodb";
import Mission from "../../../../models/Mission";
export async function GET(req) {
  try {
    await connectToDatabase();
    const missions = await Mission.find();
    // console.log(flashcards);
    return Response.json({ success: true, missions });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
