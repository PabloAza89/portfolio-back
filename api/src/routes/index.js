const { Router } = require('express');
const nodemailer = require("nodemailer");
require('dotenv').config();
const { G_USER, G_PASS, G_TO } = process.env;

const router = Router();

router.post("/message", async (req, res) => {
    const { name, text } = req.body;

      var transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
          user: G_USER,
          pass: G_PASS
        }
      })

      var mailOptions = {
        to: G_TO,
        subject: name,
        text: text,
      }

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          res.status(400).send(error.message);
        } else {
          console.log("Email enviado");
          res.status(200).jsonp(req.body);
        }
      })
  });

module.exports = router;
