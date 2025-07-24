const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});
(async () => {
  try {
    await transporter.verify();
    console.log("-------- MAIL Server is ready! -----------");
  } catch (err) {
    console.log("-------- ❌ MAIL Server is Error! -----------");
    console.log(err.message);
  }
})();

const sendOtpMail = async (email, otp) => {
  console.log("--> inside sendOtpMail", email, otp);
  try {
    await transporter.sendMail({
      from: '"HealthFirst Clinics" <maityashim81@gmail.com>',
      to: email,
      subject: "Your OTP for HealthFirst Clinics Login",
      html: `
        <html>
          <head>
            <style>
              .container {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: auto;
                background-color: #ffffff;
                border: 1px solid #10B981;
                border-radius: 10px;
                overflow: hidden;
              }
              .header {
                background-color: #1F2937;
                color: white;
                padding: 16px;
                font-size: 22px;
                font-weight: bold;
              }
              .divider {
                height: 4px;
                background-color: #10B981;
              }
              .content {
                padding: 24px;
                font-size: 16px;
                color: #111827;
              }
              .otp-box {
                background-color: #10B981;
                color: white;
                font-size: 28px;
                font-weight: bold;
                padding: 16px;
                text-align: center;
                margin: 16px 0;
                border-radius: 8px;
              }
              .footer {
                font-size: 13px;
                color: #6B7280;
                padding: 16px;
                text-align: center;
                background-color: #F9FAFB;
              }
              a {
                color: #2563EB;
                text-decoration: none;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">Email OTP</div>
              <div class="divider"></div>
              <div class="content">
                <p>Dear User,</p>
                <p>Your One-Time Password (OTP) is:</p>
                <div class="otp-box">${otp}</div>
                <p>Please use this OTP to complete your login process. Do not share this code with anyone.</p>
                <p>Thank you for using HealthFirst Clinics!</p>
              </div>
              <div class="footer">
                © 2025 <strong>HealthFirst Clinics</strong>. All rights reserved.
              </div>
            </div>
          </body>
        </html>
      `,
    });
    console.log("---> email sent!");
  } catch (err) {
    console.log("------------ 🔴 Could not send email", err.message);
    throw "Error in sending Email!";
  }
};

module.exports = { sendOtpMail };
