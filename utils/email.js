const nodemailer = require('nodemailer');
const pug = require('pug');
const htmlToText = require('html-to-text');
const sgTransport = require('nodemailer-sendgrid-transport');

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.firstName = user.firstName;
    this.url = url;
    this.from = `nir caspary <${process.env.EMAIL_FROM}>`;
  }

  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // Sengrid
      return nodemailer.createTransport(
        sgTransport({
          auth: {
            api_key: process.env.SENDGRID_KEY,
          },
        })
      );
    }
    // Create a transporter and return it
    return nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Send the mail
  async send(tamplate, subject) {
    // render HTML based on a pug tamplate
    const html = pug.renderFile(`${__dirname}/../views/email/${tamplate}.pug`, {
      firstName: this.firstName,
      url: this.url,
      subject,
    });
    // Define the email options
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      html,
      text: htmlToText.htmlToText(html),
    };

    // Create a transport and send email
    await this.newTransport().sendMail(mailOptions);
  }

  async sendPasswordReset() {
    await this.send('passwordReset', 'Your Password Reset Token (vaild for only 10 minutes)');
  }
};
