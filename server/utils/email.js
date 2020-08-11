const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const htmlToText = require('html-to-text');



const devTransporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

devTransporter.use('compile', hbs({
  viewEngine: {
    partialsDir: 'D:/Projects/next.js projects/ChatApp/chat-app/views/',
    layoutsDir: 'D:/Projects/next.js projects/ChatApp/chat-app/views/',
    defaultLayout: '',
  },
  viewPath: 'D:/Projects/next.js projects/ChatApp/chat-app/views/',
  extName: '.hbs'
}));



const prodTransporter = nodemailer.createTransport({
  service: 'SendGrid',
  auth: {
    user: process.env.SENDGRID_USERNAME,
    pass: process.env.SENDGRID_PASSWORD
  }
});

prodTransporter.use('compile', hbs({
  viewEngine: {
    partialsDir: 'D:/Projects/next.js projects/ChatApp/chat-app/views/',
    layoutsDir: 'D:/Projects/next.js projects/ChatApp/chat-app/views/',
    defaultLayout: '',
  },
  viewPath: 'D:/Projects/next.js projects/ChatApp/chat-app/views/',
  extName: '.hbs'
}));

module.exports = class Email {
  constructor(user, url) {
    this.to = user.email;
    this.name = user.username;
    this.url = url;
    this.from =` ChatAway <${process.env.EMAIL_FROM}>`
  }
  newTransport() {
    if (process.env.NODE_ENV === 'production') {
      // sendgrid
      return devTransporter;
    }
    return prodTransporter;
  }

  async send (template, subject) {
    // 1. Render HTML for email subject

    // 2. Define email options;
    const mailOptions = {
      from: this.from,
      to: this.to,
      subject,
      // htmlToText doesnt work
      text: htmlToText.fromString(template),
      template,
      context: {
        name: this.name,
        url: this.url,
        subject
      }
    }
    // Create transporter and send email
    await this.newTransport().sendMail(mailOptions)
  }

  async sendWelcome() {
    await this.send('welcome', 'Welcome to ChatAway!')
  }
  async sendResetPassword() {
    await this.send('reset-password', 'Forgot your ChatAway password?')
  }
}
