import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message } = await request.json();

    // Validar campos requeridos
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Formato de email inválido' },
        { status: 400 }
      );
    }

    // Configurar transporter (usando Gmail SMTP)
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // bfbacchi@gmail.com
        pass: process.env.EMAIL_PASSWORD, // App password de Gmail
      },
    });

    // Configurar el email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'bfbacchi@gmail.com',
      subject: `[Portfolio Contact] ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
            Nuevo mensaje desde tu portfolio
          </h2>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #495057; margin-top: 0;">Información del contacto:</h3>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Asunto:</strong> ${subject}</p>
          </div>
          
          <div style="background-color: #ffffff; padding: 20px; border: 1px solid #dee2e6; border-radius: 8px;">
            <h3 style="color: #495057; margin-top: 0;">Mensaje:</h3>
            <p style="line-height: 1.6; color: #333;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 20px; padding: 15px; background-color: #e9ecef; border-radius: 8px; font-size: 14px; color: #6c757d;">
            <p><strong>Fecha:</strong> ${new Date().toLocaleString('es-ES', { 
              timeZone: 'America/Argentina/Buenos_Aires' 
            })}</p>
            <p><strong>IP:</strong> ${request.ip || 'No disponible'}</p>
          </div>
        </div>
      `,
      replyTo: email, // Para que puedas responder directamente
    };

    // Enviar email
    await transporter.sendMail(mailOptions);

    // Enviar confirmación al usuario
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Gracias por contactarme - Bruno Bacchi',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">¡Hola ${name}!</h2>
          
          <p>Gracias por contactarme a través de mi portfolio. He recibido tu mensaje:</p>
          
          <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong> ${message}</p>
          </div>
          
          <p>Te responderé en menos de 24 horas. Mientras tanto, puedes:</p>
          <ul>
            <li>Revisar mis <a href="https://tu-portfolio.com/work" style="color: #007bff;">proyectos recientes</a></li>
            <li>Conectarte conmigo en <a href="https://www.linkedin.com/in/bruno-bacchi" style="color: #007bff;">LinkedIn</a></li>
            <li>Ver mi código en <a href="https://github.com/BFBacchi" style="color: #007bff;">GitHub</a></li>
          </ul>
          
          <p>¡Que tengas un excelente día!</p>
          <p><strong>Bruno Bacchi</strong><br>Desarrollador Fullstack</p>
          
          <hr style="margin: 30px 0; border: none; border-top: 1px solid #dee2e6;">
          <p style="font-size: 12px; color: #6c757d;">
            Este es un email automático. Por favor no respondas a este mensaje.
          </p>
        </div>
      `,
    };

    await transporter.sendMail(confirmationMailOptions);

    return NextResponse.json(
      { message: 'Mensaje enviado correctamente' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
