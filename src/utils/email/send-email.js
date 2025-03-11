import nodemailer from "nodemailer";

export const sendEmail = async ({
  to,
  subject = "confirm your email",
  html,
  text,
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    secure: false,
    auth: {
      user: process.env.EMAIL,
      pass: process.env.PASSWORD,
    },
  });
  const info = await transporter.sendMail({
    from: `${process.env.ORG_NAME} <${process.env.EMAIL}>`,
    to,
    subject,
    html,
    text,
  });
  return info;
};
