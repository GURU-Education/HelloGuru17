export async function GET() {
    console.log("key is", process.env.OPENAI_API_KEY)
    try {
      const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview-2024-12-17",
          voice: "verse",
        }),
      });
  
      const data = await response.json();
      return new Response(JSON.stringify(data), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Token generation error:", error);
      return new Response(JSON.stringify({ error: "Failed to generate token" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
}
  