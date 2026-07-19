import Replicate from "replicate";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!process.env.REPLICATE_API_TOKEN) {
    return res.status(500).json({ error: "REPLICATE_API_TOKEN no configurado" });
  }

  const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
  });

  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({ error: "El parametro id es requerido" });
    }

    const prediction = await replicate.predictions.get(id);

    return res.status(200).json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output,
      error: prediction.error,
      metrics: prediction.metrics,
    });
  } catch (error) {
    console.error("Error getting prediction:", error);
    return res.status(500).json({ error: error.message || "Error al obtener la prediccion" });
  }
}
