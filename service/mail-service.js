const nodemailer = require('nodemailer')
class MailService {

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            port: 587,
            secure: false,
            auth: {
                user: "kristinaberbooka@gmail.com",
                pass: "ttagtrfderj123k"
            }

        })
    }
    async sendActivationMail(to, link) {
        await this.transporter.sendMail({
            from: process.env.SMPT_USER,
            to,
            subject: 'Activation account on' + process.env.API_URL,
            text: "",
            html: `
            <div>
                <h1>Для активації перейдіть по ссилці</h1>
                <a href="${link}">${link}</a>
            </div>
            `
        })

    }
}

module.exports = new MailService();