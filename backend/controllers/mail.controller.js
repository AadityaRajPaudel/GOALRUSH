import nodemailer from "nodemailer";

export const sendmail = (req, res) => {
  const { email, recoveryCode } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aadityapaudel834@gmail.com",
        pass: "wjcc yxdh boil mmbj",
      },
    });

    const mailOptions = {
      from: "aadityapaudel834@gmail.com",
      to: email,
      subject: "GoalRush: Password Recovery",
      html: `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          color: #333;
          background-color: #f4f4f4;
          padding: 20px;
        }
        .email-container {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          padding: 20px;
          max-width: 600px;
          margin: 0 auto;
        }
        h2 {
          color: #4CAF50;
          font-size: 24px;
        }
        p {
          font-size: 16px;
          line-height: 1.5;
        }
        .code {
          background-color: #f4f4f4;
          border: 1px solid #ddd;
          padding: 10px;
          font-weight: bold;
          font-size: 18px;
          color: #333;
        }
        .footer {
          font-size: 14px;
          color: #777;
          text-align: center;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <h2>Password Recovery Request</h2>
        <p>Dear User,</p>
        <p>We received a request to reset your password. To complete the process, please enter the following recovery code:</p>
        <p class="code">${recoveryCode}</p>
        <p>If you did not request a password reset, please ignore this email. If you have any questions or concerns, feel free to reach out to our support team.</p>
        <p>Best regards,<br/>Your Support Team<br/>Contact: aadityapaudel834@gmail.com</p>
        <div class="footer">
          <p>&copy; 2025 GoalRush. All rights reserved.</p>
        </div>
      </div>
    </body>
  </html>
`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(400).json({
          success: false,
          message: "Failed to send code." + error,
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Code sent successfully",
        });
      }
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: "Failed to send code.",
    });
  }
};
