const sgMail = require('@sendgrid/mail')

const sendgridApiKey = process.env.SENDGRID_API_KEY

sgMail.setApiKey(sendgridApiKey)

/* sgMail.send({
    to: 'vatsalkhanna1992@gmail.com',
    from: 'vatsalkhanna26@gmail.com',
    subject: 'Welcome to Kltool',
    text: 'Hello ${name}, Thanks for joining Kltool.'
})
 */
const sendGreetingMail = (username, name) => {
    sgMail.send({
        to: username,
        from: 'vatsalkhanna26@gmail.com',
        subject: 'Welcome to Kltool',
        text: 'Hello ' + name + ', Thanks for joining Kltool.'
    })
}

const sendNewPassword = (username, password) => {
    sgMail.send({
        to: username,
        from: 'vatsalkhanna26@gmail.com',
        subject: 'New password by Kltool',
        html: '<p>Hello</p><p>Please login using your new password: <strong>' + password + '</strong></p>'
    })
}

module.exports = {
    sendGreetingMail,
    sendNewPassword
}
