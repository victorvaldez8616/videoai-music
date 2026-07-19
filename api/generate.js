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

  const HF_TOKEN = process.env.HF_TOKEN;

  if (!HF_TOKEN) {
    return res.status(500).json({ error: "HF_TOKEN no configurado" });
  }

  try {
    const { prompt, style, duration } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "El prompt es requerido" });
    }

    const styleDescriptions = {
      cinematic: "cinematic lighting, film grain, dramatic composition, photorealistic",
      neon: "neon lights, cyberpunk aesthetic, glowing purple and blue colors, night city",
      anime: "anime style, vibrant colors, detailed animation, Studio Ghibli",
      surreal: "surreal dreamlike atmosphere, abstract visuals, psychedelic colors",
    };

    const fullPrompt = `${prompt}, ${styleDescriptions[style] || ""}, music video, professional, high quality, 4k`;

    const response = await fetch(
      "https://router.huggingface.co/hf-inference/models/black-forest-labs/FLUX.1-schnell",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HF_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: fullPrompt,
          parameters: {
            width: 1024,
            height: 576,
            num_inference_steps: 4,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HF API error ${response.status}: ${errorText}`);
    }

    const imageBlob = await response.blob();
    const imageBuffer = Buffer.from(await imageBlob.arrayBuffer());
    const base64Image = imageBuffer.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    return res.status(200).json({
      id: "hf-" + Date.now(),
      status: "succeeded",
      output: dataUrl,
      type: "image",
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: error.message || "Error al generar" });
  }
}
