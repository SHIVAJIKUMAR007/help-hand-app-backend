const nodeMailer = require("nodemailer");

class Mail {
  #tranport = nodeMailer.createTransport({
    service: "gmail",
    auth: {
      user: "befilmi007@gmail.com",
      pass: "Shivaji@007",
    },
  });
  #to;
  #from;
  #subject;
  #html;
  constructor(to, sub, html) {
    this.#to = to;
    this.#from = "Help Hand <befilmi007@gmail.com>";
    this.#subject = sub;
    this.#html = html;
  }
  async sendEmail() {
    const d = await this.#tranport.sendMail({
      to: this.#to,
      from: this.#from,
      subject: this.#subject,
      html: this.#html,
    });
    console.log("email sent : ", d);
    return d;
  }
}

module.exports = Mail;
