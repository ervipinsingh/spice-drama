import nodemailer from "nodemailer";

const sendMail = async (options) => {
  console.log("🚀 sendMail function called", options.email);

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false, // 465 ke liye correct
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  // 🔥 ADD THIS (SMTP verify karega)
  try {
    await transporter.verify();
    console.log("✅ SMTP server is ready");
  } catch (err) {
    console.error("❌ SMTP VERIFY ERROR:", err);
  }

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: options.email,
    subject: options.subject,
    html: options.message,
  };

  try {
    const info = await transporter.sendMail(mailOptions); // 🔥 store response
    console.log("📧 Email sent successfully");
    console.log("📨 MAIL RESPONSE:", info);
  } catch (error) {
    console.error("❌ FULL EMAIL ERROR:", error); // 🔥 full error
  }
};

export default sendMail;
