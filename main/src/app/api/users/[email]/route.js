import connectToDatabase from "../../../../../lib/mongodb";
import User from "../../../../../models/User";

export async function GET(req, { params }) {
  try {
    await connectToDatabase();
    console.log("here")
    console.log("params is", params)
    const email = params.email;
    console.log("email is", email)

    if (!email) {
      return new Response(
        JSON.stringify({ success: false, error: "Email is required" }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });

    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "Usepr not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, user }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await connectToDatabase();

    const { email } = params.email;
    const { searchParams } = new URL(req.url);
    const expIncrease = parseInt(searchParams.get("exp"), 10); // Extract from query
    // console.log(expIncrease);

    if (!email || expIncrease === undefined) {
      return new Response(
        JSON.stringify({ success: false, error: "Missing email or EXP value" }),
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return new Response(
        JSON.stringify({ success: false, error: "User not found" }),
        { status: 404 }
      );
    }

    let newExp = user.exp + expIncrease;
    let newLevel = newExp / 1000;
    // console.log("newLevel", newLevel);

    // Perform the EXP update
    const updatedUser = await User.findOneAndUpdate(
      { email },
      { exp: newExp, level: newLevel },
      { new: true }
    );

    return new Response(JSON.stringify({ success: true, user: updatedUser }), {
      status: 200,
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 500 }
    );
  }
}
