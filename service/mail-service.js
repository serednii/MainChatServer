const nodemailer = require('nodemailer')
class MailService {

    constructor() {

        this.dataFetch = {
            method: 'POST',
            mode: 'cors', // no-cors, *cors, same-origin
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, *same-origin, omit
            headers: {
                'Content-Type': 'application/json' //application/json  multipart/form-data
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *client
        }
        this.mailPathUrl = process.env.PHP_MAIL
        this.data = {
            // admin_email: process.env.SMTP_USER,
        }

    }

    sendActivationMailPHP(user_email, link) {
        this.data.html = `
        <div>
            <h1>Для активації перейдіть по ссилці</h1>
            <a href="${link}">${link}</a>
        </div>
        `
        this.data.link = link
        this.data.user_email = user_email;
        this.dataFetch.body = JSON.stringify(this.data)

        fetch(this.mailPathUrl, this.dataFetch)
            .then(response => response.json())
            .then(result => {
                if (result.success) {
                    console.log("Dopis byl odeslán");
                    console.error('Dopis byl odeslán');
                } else {
                    console.log("Zpráva nebyla odeslána, došlo k chybě:  " + result.message);
                }
            })
            .catch(error => {
                console.log("Zpráva nebyla odeslána, došlo k chybě:  ");
                console.error('Error:', error);
            });

    }


    // constructor() {
    //     this.transporter = nodemailer.createTransport({
    //         host: "smtp.gmail.com",
    //         port: 587,
    //         secure: false,
    //         auth: {
    //             user: "kristinaberbooka@gmail.com",
    //             pass: "ttagtrfderj123k"
    //         }

    //     })
    // }


    // async sendActivationMail(to, link) {
    //     await this.transporter.sendMail({
    //         from: process.env.SMPT_USER,
    //         to,
    //         subject: 'Activation account on' + process.env.API_URL,
    //         text: "",
    //         html: `
    //         <div>
    //             <h1>Для активації перейдіть по ссилці</h1>
    //             <a href="${link}">${link}</a>
    //         </div>
    //         `
    //     })

    // }
}

module.exports = new MailService();





