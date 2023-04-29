
const sgMail = require('@sendgrid/mail');
const emailTemplates = require('./emailTemplates')
sgMail.setApiKey("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");
// .option('--sendGrid-api-key <sendGrid-api-key>', 'Send Grid API Key', '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')
        // .option('--sendGrid-mail-from <sendGrid-mail-from>', 'The sender mail Id to be used in sending the emails', 'info@easygolftour.com')
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