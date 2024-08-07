import nodemailer from "nodemailer";

export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: "live.smtp.mailtrap.io",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendBookingConfirmation(
    to: string,
    bookingDetails: any,
  ): Promise<void> {
    console.log("sending email");

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: "dont.reply.flexigym@gmail.com",
      subject: "Booking Confirmation",
      text: `Your booking has been confirmed! Details: ${JSON.stringify(bookingDetails)}`,
    };

    await this.transporter.sendMail(mailOptions);
  }
}
