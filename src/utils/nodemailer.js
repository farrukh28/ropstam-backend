import { createTransport } from "nodemailer";

const transport = createTransport({
  service: "gmail",
  secure: true,
  port: 465,
  auth: {
    user: "ropstam.test.1@gmail.com",
    pass: "yyfbngoempvmlvja",
  },
});

/**
 * @description sends email to user
 * @param {string} to email of receiver
 * @param {string} subject subject of email
 * @param {string} body html body of email
 */
export const sendEmail = (to, subject, body) => {
  try {
    transport
      .sendMail({
        from: "Ropstam mailer ropstam.test.1@gmail.com",
        to,
        subject,
        html: body,
      })
      .then((res) => {
        console.log("email sent --->", res.response);
      });
  } catch (error) {
    console.log("nodemailer error --->", error);
  }
};

/**
 * @description sends email to user
 * @param {string} to email of receiver
 * @param {string} password password
 */
export const sendWelcomeEmail = (to, password) => {
  try {
    transport
      .sendMail({
        from: `Ropstam mailer`,
        to,
        subject: "Account password",
        html: `
          <h3>Welcome 😊!</h3>
          <p>This is password for your account</p>
          <h2>${password}</h2>
          `,
      })
      .then((res) => {
        console.log("email sent --->", res.response);
      });
  } catch (error) {
    console.log("nodemailer error --->", error);
  }
};
