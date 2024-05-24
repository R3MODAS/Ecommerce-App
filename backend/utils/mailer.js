const nodemailer = require("nodemailer")

const mailer = async (email, title, body) => {
    try {
        // create a transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS
            }
        })

        // send the mail
        await transporter.sendMail({
            from: "Sharadindu Das | Ecommerce",
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`
        })

    } catch (err) {
        console.log(err.message)
    }


}

module.exports = mailer