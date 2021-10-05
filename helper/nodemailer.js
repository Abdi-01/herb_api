const nodeMailer = require("nodemailer");

// Membuat transporter dengan email Gmail, konfigurasi di akun gmail
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "herb.iostores@gmail.com",
    pass: "pqtcocszmzdprnwx",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

module.exports = transporter;
