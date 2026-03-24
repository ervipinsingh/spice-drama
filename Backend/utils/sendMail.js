import sgMail from "@sendgrid/mail";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = async ({ email, subject, message }) => {
  try {
    console.log("📤 Sending email to:", email);

    const msg = {
      to: email,
      from: "order@spicedrama.com", 
      subject,
      html: message,
    };

    const response = await sgMail.send(msg);

    console.log("✅ Email sent:", response[0].statusCode);
  } catch (error) {
    console.error(
      "❌ EMAIL ERROR:",
      error.response?.body || error.message || error,
    );
  }
};

export default sendMail;
