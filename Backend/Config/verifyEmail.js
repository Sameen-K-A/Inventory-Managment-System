import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const emailVerificationEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ServerEmail,
      pass: process.env.ServerPassword,
    },
  });

  const mailOptions = {
    from: process.env.ServerEmail,
    to: email,
    subject: 'StockMate Email Verification',
    html: `
      <div style="font-family: Helvetica, Arial, sans-serif; min-width: 100px; line-height: 1.5;">
        <div style="background-color: darkred; padding: 15px; text-align: center;">
          <h1 style="color: white; margin: 0;">StockMate</h1>
        </div>
        
        <div style="text-align: center; background-color: #f9f9f9; padding: 40px;">
          <p style="font-size: 1.2em; color: #333;">Welcome to StockMate,</p>
          <p style="font-size: 1em; color: #666; max-width: 500px; margin: 0 auto;">
            Manage your stocks very efficiently with our services. Click the verify button below to verify your email.
          </p>

          <div style="margin-top: 20px;">
            <p style="display: inline-block; padding: 10px 20px; font-size: 1em; color: #fff; background-color: darkred; text-decoration: none; border-radius: 4px;">
              ${otp}
            </p>
          </div>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification OTP email successfully sended to email ${email}`);
    return true;
  } catch (error) {
    console.error("Error in sending verfication email:", error);
    return false;
  }
};

export default emailVerificationEmail;