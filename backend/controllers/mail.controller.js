import nodemailer from "nodemailer";

export const sendmail = (req, res) => {
  const { email, recoveryCode } = req.body;
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "aadityapaudel834@gmail.com",
        pass: "99lorenzo66",
      },
    });

    const mailOptions = {
      from: "aadityapaudel834@gmail.com",
      to: email,
      subject: "Nodemailer Test Email",
      text: `Hello, the code is ${recoveryCode}`,
      html: "<h1>Hello!</h1><p>This is a test email sent with <strong>Nodemailer</strong>.</p>",
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        res.status(404).json({
          success: false,
          message: "Failed to send code.",
        });
      } else {
        res.status(200).json({
          success: true,
          message: "Code sent successfully",
        });
      }
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: "Failed to send code.",
    });
  }
};
