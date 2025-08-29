export default async function handler(req: any, res: any) {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }
  
    try {
      const { text } = req.body;
  
      const elevenResponse = await fetch(
        "https://api.elevenlabs.io/v1/text-to-speech/<YOUR_VOICE_ID>",
        {
          method: "POST",
          headers: {
            "Accept": "audio/mpeg",
            "Content-Type": "application/json",
            "xi-api-key": process.env.ELEVENLABS_API_KEY!,
          },
          body: JSON.stringify({
            text,
            voice_settings: {
              stability: 0.3,
              similarity_boost: 0.7,
            },
          }),
        }
      );
  
      const audioBuffer = await elevenResponse.arrayBuffer();
  
      res.setHeader("Content-Type", "audio/mpeg");
      res.send(Buffer.from(audioBuffer));
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "TTS failed" });
    }
  }