export async function GET() {
    try {
      const response = await fetch("https://api.openai.com/v1/realtime/sessions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-realtime-preview",
          voice: "alloy",
          temperature: 0.6,
          turn_detection: {
            type: "server_vad",
            threshold: 0.8,
            // prefix_padding_ms: 300,
            // silence_duration_ms: 300,     
        }
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
  