
const emailTemplates = {
    forgotPassword(data) {

        return {
            subject: 'Password Reset',
            html: getFullTemplate(data,`
                <div class="f-fallback">
                    <h1>Hi ${data.req.body.email},</h1>
                    <p>You are receiving this email because you (or someone else) has requested
                        the reset of the password for your account.

                    </p>
                    <table class="body-action" align="center" width="100%" cellpadding="0"
                        cellspacing="0" role="presentation">
                        <tr>
                            <td align="center">
                                <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                    role="presentation">
                                    <tr>
                                        <td align="center">
                                            <a href="${process.env.FRONTEND_URL}auth/reset-password/${data.token}"
                                                class="f-fallback button " target="_blank">Reset
                                                your password</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <p>If you did not request this, please ignore this email and your password
                        will remain unchanged.</p>
                    <p>Thanks,
                        <br>The Studyzone team
                    </p>
                    <!-- Sub copy -->
                    <table class="body-sub" role="presentation">
                        <tr>
                            <td>
                                <p class="f-fallback sub">If you’re having trouble with the
                                    button above, copy and paste the URL below into your web
                                    browser.</p>
                                <p class="f-fallback sub">
                                    ${process.env.FRONTEND_URL}auth/reset-password/${data.token}
                                </p>
                            </td>
                        </tr>
                    </table>
                </div>
            `)
        }
    },
    inviteUser(data) {
        return {
            subject: 'Invitation to signup',
            html: getFullTemplate(data,`
                    <div class="f-fallback">
                        <h1>Hi ${data.req.body.email},</h1>
                        <p>We are excited to invite you to join our online portal! Our portal offers
                            a convenient way to access our services and stay up-to-date with
                            important information.

                        </p>
                        <p>We look forward to having you as a member of our online community! 
                            <!-- <strong>This invitation link is only valid for the next 24
                                hours.</strong> -->
                                </p>
                        <table class="body-action" align="center" width="100%" cellpadding="0"
                            cellspacing="0" role="presentation">
                            <tr>
                                <td align="center">
                                    <table width="100%" border="0" cellspacing="0" cellpadding="0"
                                        role="presentation">
                                        <tr>
                                            <td align="center">
                                                <a href="${process.env.FRONTEND_URL}auth/complete-signup/${data.email}/${data.token}"
                                                    class="f-fallback button "
                                                    target="_blank">Accept the Invitation</a>
                                            </td>
                                        </tr>
                                    </table>
                                </td>
                            </tr>
                        </table>
                        <!-- <p>For security, this request was received from a {{operating_system}} device using {{browser_name}}. If you do not want to join, please ignore this email or <a href="{{support_url}}">contact support</a> if you have questions.</p> -->
                        <p>Thanks,
                            <br>The Studyzone team
                        </p>
                        <!-- Sub copy -->
                        <table class="body-sub" role="presentation">
                            <tr>
                                <td>
                                    <p class="f-fallback sub">If you’re having trouble with the
                                        button above, copy and paste the URL below into your web
                                        browser.</p>
                                    <p class="f-fallback sub">
                                    ${process.env.FRONTEND_URL}auth/complete-signup/${data.email}/${data.token}
                                    </p>
                                </td>
                            </tr>
                        </table>
                    </div>
                `)
        }
    }

}

const getFullTemplate = (data,body) => {
    console.log(data.req.headers.host);
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
   <html xmlns="www.w3.org/1999/xhtml">
   
   <head>
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <meta name="x-apple-disable-message-reformatting" />
       <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
       <meta name="color-scheme" content="light dark" />
       <meta name="supported-color-schemes" content="light dark" />
       <title></title>
       <style type="text/css" rel="stylesheet" media="all">
           @import url("https://fonts.googleapis.com/css?family=Nunito+Sans:400,700&display=swap");
   
           .ii a[href] {
               color: white !important
           }
   
           img {
               width: 165px
           }
   
           h1,
           h2,
           h3 {
               margin-top: 0;
               color: #333;
               text-align: left;
               font-weight: 700
           }
   
           .button,
           body {
               -webkit-text-size-adjust: none
           }
   
           .purchase_total,
           h1,
           h2,
           h3 {
               font-weight: 700
           }
   
           body {
               width: 100% !important;
               height: 100%;
               margin: 0;
               background-color: #f2f4f6;
               color: #51545e
           }
   
           a {
               color: #fff
           }
   
           a[href] {
               color: #fff !important
           }
   
           a img {
               border: none
           }
   
           td {
               word-break: break-word
           }
   
           .preheader {
               display: none !important;
               visibility: hidden;
               mso-hide: all;
               font-size: 1px;
               line-height: 1px;
               max-height: 0;
               max-width: 0;
               opacity: 0;
               overflow: hidden
           }
   
           .purchase_item,
           .related_item {
               font-size: 15px;
               line-height: 18px
           }
   
           body,
           td,
           th {
               font-family: "Nunito Sans", Helvetica, Arial, sans-serif
           }
   
           h1 {
               font-size: 22px
           }
   
           h2 {
               font-size: 16px
           }
   
           h3 {
               font-size: 14px
           }
   
           td,
           th {
               font-size: 16px
           }
   
           blockquote,
           ol,
           p,
           ul {
               margin: .4em 0 1.1875em;
               font-size: 16px;
               line-height: 1.625
           }
   
           p.sub {
               font-size: 13px
           }
   
           .align-right {
               text-align: right
           }
   
           .align-left {
               text-align: left
           }
   
           .align-center,
           .discount_heading {
               text-align: center
           }
   
           .u-margin-bottom-none {
               margin-bottom: 0
           }
   
           .button {
               background-color: #fff;
              
               display: inline-block;
               color: #15c;
               text-decoration: none;
               border-radius: 3px;
               box-shadow: 0 2px 3px rgba(0, 0, 0, .16);
               box-sizing: border-box;
               border: 1px solid #15c;
               padding: 8px 16px;
               cursor: pointer;
           }
   
           .button--green {
               background-color: #22bc66;
               border-top: 10px solid #22bc66;
               border-right: 18px solid #22bc66;
               border-bottom: 10px solid #22bc66;
               border-left: 18px solid #22bc66
           }
   
           .button--red {
               background-color: #ff6136;
               border-top: 10px solid #ff6136;
               border-right: 18px solid #ff6136;
               border-bottom: 10px solid #ff6136;
               border-left: 18px solid #ff6136
           }
   
           @media only screen and (max-width:500px) {
               .button {
                   width: 100% !important;
                   text-align: center !important
               }
           }
   
           .discount,
           .purchase_content,
           .related {
               width: 100%;
               -premailer-width: 100%;
               -premailer-cellpadding: 0;
               -premailer-cellspacing: 0
           }
   
           .attributes {
               margin: 0 0 21px
           }
   
           .attributes_content {
               background-color: #f4f4f7;
               padding: 16px
           }
   
           .attributes_item {
               padding: 0
           }
   
           .purchase_content,
           .related {
               margin: 0;
               padding: 25px 0 0
           }
   
           .related_item {
               padding: 10px 0;
               color: #cbcccf
           }
   
           .related_item-title {
               display: block;
               margin: .5em 0 0
           }
   
           .related_item-thumb {
               display: block;
               padding-bottom: 10px
           }
   
           .related_heading {
               border-top: 1px solid #cbcccf;
               text-align: center;
               padding: 25px 0 10px
           }
   
           .discount {
               margin: 0;
               padding: 24px;
               background-color: #f4f4f7;
               border: 2px dashed #cbcccf
           }
   
           .social,
           .social td {
               width: auto
           }
   
           .body-sub,
           .purchase_footer {
               border-top: 1px solid #eaeaec
           }
   
           .discount_body {
               text-align: center;
               font-size: 15px
           }
   
           .social td {
               padding: 0
           }
   
           .social_icon {
               height: 20px;
               margin: 0 8px 10px;
               padding: 0
           }
   
           .purchase {
               width: 100%;
               margin: 0;
               padding: 35px 0;
               -premailer-width: 100%;
               -premailer-cellpadding: 0;
               -premailer-cellspacing: 0
           }
   
           .purchase_item {
               padding: 10px 0;
               color: #51545e
           }
   
           .purchase_heading {
               padding-bottom: 8px;
               border-bottom: 1px solid #eaeaec
           }
   
           .purchase_heading p {
               margin: 0;
               color: #85878e;
               font-size: 12px
           }
   
           .purchase_footer {
               padding-top: 15px
           }
   
           .purchase_total {
               margin: 0;
               text-align: right;
               color: #333
           }
   
           .body-action,
           .email-footer,
           .email-masthead {
               text-align: center
           }
   
           .purchase_total--label {
               padding: 0 15px 0 0
           }
   
           .email-body,
           .email-content,
           .email-wrapper {
               width: 100%;
               margin: 0;
               padding: 0;
               -premailer-width: 100%;
               -premailer-cellpadding: 0;
               -premailer-cellspacing: 0
           }
   
           p {
               color: #51545e
           }
   
           .email-wrapper {
               background-color: #f2f4f6
           }
   
           .email-masthead {
               padding: 25px 0;
               display: flex;
               align-items: center;
               justify-content: center;
           }
   
           .email-masthead_logo {
               width: 94px;
           }
   
           .email-body_inner,
           .email-footer {
               width: 570px;
               margin: 0 auto;
               -premailer-width: 570px;
               padding: 0;
               -premailer-cellpadding: 0;
               -premailer-cellspacing: 0
           }
   
           .email-masthead_name {
               font-size: 16px;
               font-weight: 700;
               color: #a8aaaf;
               text-decoration: none;
               text-shadow: 0 1px 0 #fff
           }
   
           .email-body_inner {
               background-color: #fff
           }
   
           .email-footer p {
               color: #a8aaaf
           }
   
           .body-action {
               width: 100%;
               margin: 30px auto;
               padding: 0;
               -premailer-width: 100%;
               -premailer-cellpadding: 0;
               -premailer-cellspacing: 0
           }
   
           .body-sub {
               margin-top: 25px;
               padding-top: 25px
           }
   
           .content-cell {
               padding: 45px
           }
   
           @media only screen and (max-width:600px) {
   
               .email-body_inner,
               .email-footer {
                   width: 100% !important
               }
           }
   
           @media (prefers-color-scheme:dark) {
   
               .email-body,
               .email-body_inner,
               .email-content,
               .email-footer,
               .email-masthead,
               .email-wrapper,
               body {
                   background-color: #333 !important;
                   color: #fff !important
               }
   
               .purchase_item,
               blockquote,
               h1,
               h2,
               h3,
               ol,
               p,
               span,
               ul {
                   color: #fff !important
               }
   
               .attributes_content,
               .discount {
                   background-color: #222 !important
               }
   
               .email-masthead_name {
                   text-shadow: none !important
               }
           }
   
           :root {
               color-scheme: light dark;
               supported-color-schemes: light dark
           }
       </style>
   </head>
   
   <body>
       <!--<span class="preheader">Use this link to reset your password. The link is only valid for 24 hours.</span>-->
       <table class="email-wrapper" width="100%" cellpadding="0" cellspacing="0" role="presentation">
           <tr>
               <td align="center">
                   <table class="email-content" width="100%" cellpadding="0" cellspacing="0" role="presentation">
                       <tr>
                           <td class="email-masthead">
                            <img src="https://${data.req.headers.host}/media/logo/studyzone.svg" >Study Zone
                           </td>
                       </tr>
                       <!-- Email Body -->
                       <tr>
                           <td class="email-body" width="570" cellpadding="0" cellspacing="0">
                               <table class="email-body_inner" align="center" width="570" cellpadding="0" cellspacing="0"
                                   role="presentation">
                                   <!-- Body content -->
                                   <tr>
                                       <td class="content-cell">
   
                                       ${body}
                                       
                                       </td>
                                       </tr>
                                   </table>
                               </td>
                           </tr>
                           <tr>
                               <td>
                                   <table class="email-footer" align="center" width="570" cellpadding="0" cellspacing="0"
                                       role="presentation">
                                       <tr>
                                           <td class="content-cell" align="center">
                                               <p class="f-fallback sub align-center">
                                                   Studyzone
                                               </p>
                                           </td>
                                       </tr>
                                   </table>
                               </td>
                           </tr>
                       </table>
                   </td>
               </tr>
           </table>
       </body>
       
       </html>
                                  

    `
}


module.exports = emailTemplates