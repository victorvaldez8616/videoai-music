import Replicate from "replicate";

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

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: "REPLICATE_API_TOKEN no configurado" });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { prompt, style, duration } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es requerido" });
    }

    const styleDescriptions = {
      cinematic: "cinematic lighting, film grain, dramatic composition",
      neon: "neon lights, cyberpunk aesthetic, glowing colors, night city",
      anime: "anime style, vibrant colors, detailed animation",
      surreal: "surreal dreamlike atmosphere, abstract visuals, psychedelic",
    };

    const fullPrompt = `${prompt}, ${styleDescriptions[style] || ""}, music video, professional, high quality, smooth motion`;

    const videoDuration = Math.min(Math.max(parseInt(duration) || 5, 1), 16);

    const prediction = await replicate.predictions.create({
      model: "wavespeedai/wan-2.1-t2v-480p",
      input: {
        prompt: fullPrompt,
        num_frames: Math.round(videoDuration * 8),
      },
    });

    return res.status(201).json({
      id: prediction.id,
      status: prediction.status,
    });
  } catch (error) {
    console.error("Error creating prediction:", error);
    return res.status(500).json({ error: error.message || "Error al crear la prediccion" });
  }
}
