import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async (options) => {
  console.log("🚀 sendMail function called", options.email);
  const msg = {
    to: options.email,
    from: "order@spicedrama.com", 
    subject: options.subject,
    html: options.message,
  };

  try {
    const response = await sgMail.send(msg);
    console.log("📧 Email sent:", response[0].statusCode);
  } catch (error) {
    console.error("❌ EMAIL ERROR:", error.response?.body || error);
  }
};

export default sendMail;
