import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();



const sendDataEmail = async (email, data) => {
   const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
         user: process.env.ServerEmail,
         pass: process.env.ServerPassword,
      },
   });

   const tableRows = data.map((item, index) => `
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;">${index + 1}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.productName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.customerName}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.date}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
      <td style="padding: 8px; border: 1px solid #ddd;">${item.price}</td>
    </tr>
  `).join("");

   const mailOptions = {
      from: process.env.ServerEmail,
      to: email,
      subject: 'StockMate Order Summary',
      html: `
      <div style="font-family: Helvetica, Arial, sans-serif; line-height: 1.5;">
        <div style="background-color: darkred; padding: 15px; text-align: center;">
          <h1 style="color: white; margin: 0;">StockMate</h1>
        </div>

        <div style="padding: 20px; background-color: #f9f9f9;">
          <p style="font-size: 1.2em; color: #333;">Order Summary</p>
          <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
            <thead>
              <tr style="background-color: black; color: white;">
                <th style="padding: 8px; border: 1px solid #ddd;">SL</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Product Name</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Customer Name</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Time & Date</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Quantity</th>
                <th style="padding: 8px; border: 1px solid #ddd;">Total Amount</th>
              </tr>
            </thead>
            <tbody>
              ${tableRows}
            </tbody>
          </table>
        </div>
      </div>
    `,
   };

   try {
      await transporter.sendMail(mailOptions);
      console.log(`Order summary email successfully sent to ${email}`);
      return true;
   } catch (error) {
      console.error("Error in sending order summary email:", error);
      return false;
   }
};

export default sendDataEmail;