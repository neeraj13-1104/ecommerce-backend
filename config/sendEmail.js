import nodemailer from "nodemailer";

const sendEmail = async (to, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 🔍 VERY IMPORTANT
    await transporter.verify();
    console.log("✅ Gmail transporter verified");

    const info = await transporter.sendMail({
      from: `"Store Support" <${process.env.EMAIL}>`,
      to,
      subject,
      text,
    });

    console.log("✅ Mail sent:", info.response);
  } catch (error) {
    console.error("❌ MAIL ERROR FULL:", error);
    throw error;
  }
};

export default sendEmail;
