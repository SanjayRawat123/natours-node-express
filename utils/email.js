// first install node mailer npm i nodemailer
const nodemailer = require('nodemailer');
const htmlToText = require('html-to-text');
const fs = require('fs');
const path = require('path');

function readHTMLTemplate(templateName) {
  try {
    // ../public/${templateName}.html
    const templatePath = path.join(__dirname, '..', 'public', `${templateName}.html`); // Path to your HTML templates
    const htmlTemplate = fs.readFileSync(templatePath, 'utf-8');
    return htmlTemplate;
  } catch (error) {
    console.error('Error reading template file:', error);
    return null;
  }
}

function replacePlaceholders(template, data) {
  let replacedTemplate = template;
  Object.keys(data).forEach(key => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    replacedTemplate = replacedTemplate.replace(regex, data[key]);
  });
  return replacedTemplate;
}

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.name.split(' ')[0];
    this.url = url;
    this.from = `Sanjay Rawat <${process.env.EMAIL_FROM}>`;
  }


  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      //Sendgrid
      return nodemailer.createTransport({
        service: 'SendGrid',
        auth: {
          user: process.env.SENDGRID_USERNAME,
          pass: process.env.SENDGRID_PASSWORD
        }
      });
    }

    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD
      }
    });

  }

  async send(template, subject) {
    // 1) Render HTML based
    const htmlTemplate = readHTMLTemplate(template);

    if (htmlTemplate) {
      const userData = {
        USERNAME: this.firstName,
        EMAIL: this.to,
        RESET_LINK: this.url
      };

      const replacedTemplate = replacePlaceholders(htmlTemplate, userData);

      const options = {
        wordwrap: 130,
        // ...
      };
      const compiledConvert = htmlToText.compile(options); // options passed here
      const text = compiledConvert(replacedTemplate);
      console.log(text);
      // 2) Define email options here
      const mailOptions = {
        from: this.from,
        to: this.to,
        subject,
        html: replacedTemplate,
        text: text
      };

      //3) create transport and send email 

      await this.newTransport().sendMail(mailOptions);


    }
  };

  async sendWelcome() {
    await this.send('welcome', "Welcome to the Sanjay's family !");
  }

  async sendResetPassword() {
    await this.send('restPassword',
      'Your password reset token (valid for only 10 minutes)');
  }


};
