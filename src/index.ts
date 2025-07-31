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

const transporter = nodemailer.createTransporter({
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
    const {
      name,
      lastName,
      email,
      phone,
      message,
      nombre,
      correo,
      telefono,
      mensaje,
    } = req.body;

    const fullName = name && lastName ? `${name} ${lastName}` : name || nombre;
    const userEmail = email || correo;
    const userPhone = phone || telefono;
    const userMessage = message || mensaje;

    const data = await transporter.sendMail({
      from: nombre,
      to: "portafoliopersonal22@gmail.com",
      subject: "¡Te han contactado!",
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Nuevo Contacto</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); overflow: hidden;">
                

                <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px 20px; text-align: center;">
                    <h1 style="margin: 0; font-size: 28px; font-weight: 600; letter-spacing: -0.5px;">
                      Nuevo Contacto
                    </h1>
                    <p style="margin: 8px 0 0 0; font-size: 14px; opacity: 0.9;">
                        Alguien está interesado en tu trabajo
                    </p>
                </div>

                <div style="padding: 40px 30px;">
                    

                    <div style="background-color: #f8fafc; border-radius: 10px; padding: 25px; margin-bottom: 25px; border-left: 4px solid #667eea;">
                        <h2 style="margin: 0 0 20px 0; color: #2d3748; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                            Información de Contacto
                        </h2>
                        
                        <div style="display: grid; gap: 15px;">
                            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                <span style="color: #667eea; font-weight: 600; min-width: 80px; font-size: 14px;">Nombre:</span>
                                <span style="color: #2d3748; font-size: 16px; font-weight: 500;">${fullName}</span>
                            </div>
                            
                            <div style="display: flex; align-items: center; padding: 12px 0; border-bottom: 1px solid #e2e8f0;">
                                <span style="color: #667eea; font-weight: 600; min-width: 80px; font-size: 14px;">Email:</span>
                                <a href="mailto:${userEmail}" style="color: #667eea; text-decoration: none; font-size: 16px; font-weight: 500;">${userEmail}</a>
                            </div>
                            
                            <div style="display: flex; align-items: center; padding: 12px 0;">
                                <span style="color: #667eea; font-weight: 600; min-width: 80px; font-size: 14px;">Teléfono:</span>
                                <a href="tel:${userPhone}" style="color: #667eea; text-decoration: none; font-size: 16px; font-weight: 500;">${userPhone}</a>
                            </div>
                        </div>
                    </div>

                    <div style="background-color: #f8fafc; border-radius: 10px; padding: 25px; border-left: 4px solid #38b2ac;">
                        <h3 style="margin: 0 0 15px 0; color: #2d3748; font-size: 18px; font-weight: 600; display: flex; align-items: center;">
                            Mensaje
                        </h3>
                        <div style="background-color: white; padding: 20px; border-radius: 8px; border: 1px solid #e2e8f0; line-height: 1.6; color: #2d3748; font-size: 15px;">
                            ${userMessage}
                        </div>
                    </div>

                    <div style="margin-top: 30px; text-align: center;">
                        <a href="mailto:${userEmail}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 0 10px; font-size: 14px; box-shadow: 0 2px 10px rgba(102, 126, 234, 0.3);">
                            Responder Email
                        </a>
                        <a href="tel:${userPhone}" style="display: inline-block; background: linear-gradient(135deg, #38b2ac 0%, #4fd1c7 100%); color: white; padding: 12px 25px; text-decoration: none; border-radius: 25px; font-weight: 600; margin: 0 10px; font-size: 14px; box-shadow: 0 2px 10px rgba(56, 178, 172, 0.3);">
                           Llamar
                        </a>
                    </div>
                </div>

                <!-- Footer -->
                <div style="background-color: #2d3748; color: #a0aec0; padding: 20px; text-align: center;">
                    <p style="margin: 0; font-size: 12px;">
                        ${new Date().toLocaleDateString("es-ES", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                    </p>
                    <p style="margin: 5px 0 0 0; font-size: 11px; opacity: 0.7;">
                        Enviado desde tu portafolio personal
                    </p>
                </div>
            </div>
        </body>
        </html>
      `,
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
