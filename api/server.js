const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
const nodemailer = require("nodemailer");
require('dotenv').config();
const { G_USER, G_PASS, G_TO, ALLOWED_REQ } = process.env;




app.use(express.json());
app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // update to match the domain you will make the request from //
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  next();
});

app.post("/", async (req, res) => {
    const { name, text } = req.body;
    let origin = req.get('origin');
    console.log("esto", origin)
     if (origin === ALLOWED_REQ) {
        var transporter = nodemailer.createTransport({
          host: "smtp.gmail.com",
          post: 587,
          secure: false,
          auth: {
            user: process.env.G_USER,
            pass: process.env.G_PASS
          }
        })

        var mailOptions = {
          to: process.env.G_TO,
          subject: name,
          text: text,
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(error.status).send(console.log(error));
          } else {
            console.log("Email enviado");
            res.status(200).jsonp(req.body);
          }
        })

    } else {
        res.status(400).send("Not Allowed");
    }

   
        
  
  
  });

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    console.error(err);
    res.status(status).send(message);
  });

app.listen(process.env.PORT || 3001);
