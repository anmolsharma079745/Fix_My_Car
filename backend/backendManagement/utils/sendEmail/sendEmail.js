const { Resend } = require("resend");

const resend = new Resend(
    process.env.RESEND_API_KEY
);

const sendOTPEmail = async (email, otp) => {

    try {

        const { data, error } = await resend.emails.send({

            from: "Fix My Ride <onboarding@resend.dev>",

            to: [email],

            subject:
                "Fix My Ride - Password Reset OTP",

            html: `
                <div
                    style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: 0 auto;
                        padding: 30px;
                        background-color: #f5f7fb;
                    "
                >

                    <div
                        style="
                            background-color: #ffffff;
                            padding: 30px;
                            border-radius: 12px;
                            text-align: center;
                        "
                    >

                        <h2
                            style="
                                color: #2563eb;
                                margin-bottom: 20px;
                            "
                        >
                            FIX MY RIDE
                        </h2>

                        <h3>
                            Password Reset
                        </h3>

                        <p
                            style="
                                color: #555;
                                font-size: 15px;
                            "
                        >
                            You requested to reset your password.
                        </p>

                        <p
                            style="
                                color: #555;
                                font-size: 15px;
                            "
                        >
                            Your One-Time Password (OTP) is:
                        </p>

                        <div
                            style="
                                margin: 25px 0;
                                padding: 15px;
                                background-color: #f1f5ff;
                                border-radius: 8px;
                            "
                        >

                            <h1
                                style="
                                    letter-spacing: 8px;
                                    color: #2563eb;
                                    margin: 0;
                                "
                            >
                                ${otp}
                            </h1>

                        </div>

                        <p
                            style="
                                color: #555;
                                font-size: 14px;
                            "
                        >
                            This OTP is valid for
                            <strong>10 minutes</strong>.
                        </p>

                        <p
                            style="
                                color: #777;
                                font-size: 13px;
                                margin-top: 25px;
                            "
                        >
                            If you did not request a password reset,
                            please ignore this email.
                        </p>

                        <hr
                            style="
                                border: none;
                                border-top: 1px solid #eee;
                                margin: 25px 0;
                            "
                        >

                        <p
                            style="
                                color: #999;
                                font-size: 12px;
                            "
                        >
                            This is an automated email from Fix My Ride.
                            Please do not reply to this email.
                        </p>

                    </div>

                </div>
            `
        });



        if (error) {

            console.error(
                "RESEND EMAIL ERROR:",
                error
            );

            throw new Error(
                error.message || "Failed to send OTP email"
            );
        }



        console.log(
            "OTP EMAIL SENT SUCCESSFULLY:",
            data?.id
        );

        return data;


    } catch (err) {
        console.error(
            "SEND OTP EMAIL ERROR:",
            err
        );
        throw err;
    }
};

module.exports = sendOTPEmail;
