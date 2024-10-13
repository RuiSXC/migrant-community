const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "rgao0017@student.monash.edu",
    pass: "gyxicoenxfounwea",
  },
});

exports.sendBookingEmail = async (form) => {
  const mailOptions = {
    from: "rgao0017@student.monash.edu",
    to: form.email,
    subject: "Reservation Confirmation",
    text: `Dear ${form.name}, your reservation is confirmed ` +
      `at ${form.time} for ${form.guests} guests.`,
    attachments: [
      {
        filename: "reservation-details.txt",
        content: `
        Reservation Details:
          Name: ${form.name}
          Time: ${form.time}
          Email: ${form.email}
          Guests: ${form.guests}
          Phone: ${form.phone}
          Notes: ${form.notes || ""}
          Created At: ${form.createdAt}
        `,
      },
    ],
  };
  await transporter.sendMail(mailOptions);
};

exports.sendMail = async ({email, subject, message}) => {
  const mailOptions = {
    from: "rgao0017@student.monash.edu",
    to: email,
    subject: subject,
    text: message,
  };

  await transporter.sendMail(mailOptions);
};
