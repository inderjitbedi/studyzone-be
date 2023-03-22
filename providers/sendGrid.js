
const sgMail = require('@sendgrid/mail');
const emailTemplates = require('./emailTemplates')
sgMail.setApiKey("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");

const sendGrid = {
    async send(toEmail, templateType, templateData) {
        console.log("sendGrid:send:args =", toEmail, templateType);
        const email = {
            to: toEmail,
            from: {
                name:"noreply-dev-easygolf",
                email:"aspiringingenuity@gmail.com"
            },
            subject: emailTemplates[templateType](templateData).subject,
            html: emailTemplates[templateType](templateData).html
        };
        await sgMail.send(email).then(() => {
            console.log('sendGrid:send Successfully sent at ' + toEmail);
        }).catch(error => {
            console.error("sendGrid:send:error - ",error.toString());
        });
    }
}
module.exports = sendGrid