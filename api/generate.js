export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt, style } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es requerido" });
    }

    const styleDescriptions = {
      cinematic: "cinematic lighting, film grain, dramatic composition, photorealistic, movie scene",
      neon: "neon lights, cyberpunk aesthetic, glowing purple blue colors, night city, vaporwave",
      anime: "anime style, vibrant colors, detailed animation, Studio Ghibli style",
      surreal: "surreal dreamlike atmosphere, abstract visuals, psychedelic colors, Salvador Dali style",
    };

    const fullPrompt = `${prompt}, ${styleDescriptions[style] || ""}, music video, professional, high quality, 4k, masterpiece`;

    const encodedPrompt = encodeURIComponent(fullPrompt);
    const seed = Math.floor(Math.random() * 999999);
    const imageUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=576&nologo=true&seed=${seed}`;

    const testResponse = await fetch(imageUrl, { method: "HEAD" });
    if (!testResponse.ok) {
      throw new Error("Error generando imagen");
    }

    return res.status(200).json({
      id: "gen-" + Date.now(),
      status: "succeeded",
      output: imageUrl,
      type: "image",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Error al generar" });
  }
}
