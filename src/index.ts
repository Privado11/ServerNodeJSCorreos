import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import sgMail from "@sendgrid/mail";
import dotenv from "dotenv";

import type { Request, Response } from "express"; 

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const port = 3000;


const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const EMAIL_TO = process.env.EMAIL_TO;

if (!SENDGRID_API_KEY)
  throw new Error("SENDGRID_API_KEY no está definido en .env");
if (!EMAIL_TO) throw new Error("EMAIL_TO no está definido en .env");

sgMail.setApiKey(SENDGRID_API_KEY);

app.get("/", (req: Request, res: Response) => {
  res.send("<p>¡Servidor activo!</p>");
});

app.get("/ping", (req: Request, res: Response) => {
  res.send("Ping exitoso");
});

app.post("/enviar-correo", async (req: Request, res: Response) => {
  try {
    const { name, lastName, email, phone, message } = req.body;
    const fullName = `${name} ${lastName}`;

    const msg = {
      to: EMAIL_TO,
      from: "Portafolio Personal <contacto@walterjimenez.online>",
      subject: "¡Te han contactado!",
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
          <h2 style="color: #2a9d8f;">Nuevo mensaje desde tu Portafolio</h2>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <tr>
              <td style="padding: 8px; font-weight: bold; width: 120px;">Nombre:</td>
              <td style="padding: 8px;">${fullName}</td>
            </tr>
            <tr style="background-color: #f4f4f4;">
              <td style="padding: 8px; font-weight: bold;">Correo:</td>
              <td style="padding: 8px;">${email}</td>
            </tr>
            <tr>
              <td style="padding: 8px; font-weight: bold;">Teléfono:</td>
              <td style="padding: 8px;">${phone}</td>
            </tr>
            <tr style="background-color: #f4f4f4;">
              <td style="padding: 8px; font-weight: bold;">Mensaje:</td>
              <td style="padding: 8px;">${message}</td>
            </tr>
          </table>
          <p style="margin-top: 20px; font-size: 0.9em; color: #555;">
            Este mensaje fue enviado desde tu formulario de contacto en <strong>Portafolio Personal</strong>.
          </p>
        </div>
      `,
    };

    await sgMail.send(msg);
    res.status(200).send("Correo enviado con éxito");
  } catch (error) {
    console.error("Error al enviar el correo:", error);
    res.status(500).send("Error al enviar el correo");
  }
});

app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
