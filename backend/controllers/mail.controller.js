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
      subject: "Nodemailer Test Email",
      text: `Hello, the code is ${recoveryCode}`,
      html: `Hello, the code is ${recoveryCode}`,
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
