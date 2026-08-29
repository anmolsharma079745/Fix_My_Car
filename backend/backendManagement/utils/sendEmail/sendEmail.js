const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",

    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendOTPEmail = async (email, otp) => {

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,

        subject: "Fix My Ride - Password Reset OTP",

        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px;">

                <h2>Fix My Ride</h2>

                <p>
                    You requested to reset your password.
                </p>

                <p>
                    Your OTP is:
                </p>

                <h1 style="letter-spacing: 5px;">
                    ${otp}
                </h1>

                <p>
                    This OTP is valid for 10 minutes.
                </p>

                <p>
                    If you did not request a password reset,
                    please ignore this email.
                </p>

            </div>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendOTPEmail;