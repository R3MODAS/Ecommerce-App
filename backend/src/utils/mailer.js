import nodemailer from "nodemailer";

export const mailer = async (email, title, body) => {
    try {
        // create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // send the mail and get the response
        const info = await transporter.sendMail({
            from: "Sharadindu Das 👻",
            to: email,
            subject: title,
            html: body,
        });
    } catch (err) {
        console.log(err.message);
    }
};
