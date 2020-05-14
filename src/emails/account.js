const sgMail = require('@sendgrid/mail')

const sendgridApiKey = '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'

sgMail.setApiKey(sendgridApiKey)

const sendGreetingMail = (username, name) => {
    sgMail.send({
        to: username,
        from: 'vatsalkhanna1992@gmail.com',
        subject: 'Welcome to Kltool',
        text: 'Hello ${name}, Thanks for joining Kltool.'
    })
}

module.exports = {
    sendGreetingMail
}