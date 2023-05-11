
const sgMail = require('@sendgrid/mail');
const emailTemplates = require('./emailTemplates')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
sgMail.setApiKey("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");

const sendGrid = {
    async send(toEmail, templateType, templateData) {
        console.log("sendGrid:send:args =", toEmail, templateType);
        const email = {
            to: toEmail,
            from: {
                name:"<no-reply@studyzone>",
                email:"info@easygolftour.com"
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