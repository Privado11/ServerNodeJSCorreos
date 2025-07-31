const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors());
const port = 3000;

app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<p>¡Servidor activo!</p>");
});

app.get("/ping", (req, res) => {
  res.send("Ping exitoso");
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});

app.post("/enviar-correo", async (req, res) => {
  try {
    const { name, lastName, email, phone, message } = req.body;

    const fullName = `${name} ${lastName}`;
    const userEmail = email;
    const userPhone = phone;
    const userMessage = message;

    const data = await transporter.sendMail({
      from: fullName,
      to: "portafoliopersonal22@gmail.com",
      subject: "¡Te han contactado!",
      html: `<p><strong>Nombre: ${fullName}</strong></p>
            <p><strong>Correo: ${userEmail}</strong></p>
            <p><strong>Teléfono: ${userPhone}</strong></p>
            <p><strong>Mensaje: ${userMessage}</strong></p>`,
    });
    res.status(200).send("Correo enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo");
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución`);
});
