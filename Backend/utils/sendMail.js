import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendMail = async (options) => {
  console.log("🚀 sendMail function called", options.email);

  try {
    const info = await transporter.sendMail({
      from: "Spice Drama <order@spicedrama.com>",
      to: options.email,
      subject: options.subject,
      html: options.message,
    });

    console.log("📧 Email sent:", info.messageId);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error);
  }
};

export default sendMail;
