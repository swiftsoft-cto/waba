const express = require("express");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN;

if (!VERIFY_TOKEN) {
  console.warn(
    "WHATSAPP_VERIFY_TOKEN nao configurado. Defina no .env antes de verificar o webhook."
  );
}

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/webhook", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

app.post("/webhook", (req, res) => {
  console.log("Evento recebido do WhatsApp:", JSON.stringify(req.body, null, 2));
  return res.sendStatus(200);
});

app.listen(PORT, () => {
  console.log(`Webhook API rodando na porta ${PORT}`);
});
