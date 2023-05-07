const express = require("express");
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const app = express();
require('dotenv').config(); // ONLY IN LOCALHOST
const { PORT, G_USER, G_PASS, G_TO, ALLOWED_REQ } = process.env;
const nodemailer = require("nodemailer");

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

    let forwarded = req.headers['x-forwarded-for'] || 'no data';
    let peernameSocket = req.socket['_peername'] || 'no data';
    let remoteAddress = JSON.stringify(req.socket.remoteAddress) || 'no data';
    let platform = req.headers['sec-ch-ua-platform'] || 'no data';
    let mobile = req.headers['sec-ch-ua-mobile'] || 'no data';
    let useragent = req.headers['user-agent'] || 'no data';
    let origin = req.headers['origin'] || 'no data';
    let language = req.headers['accept-language'] || 'no data';

     if (origin === ALLOWED_REQ) {
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
          text: text.concat(`\n\nforwarded: ${forwarded}`, `\npeernameSocket: ${JSON.stringify(peernameSocket)}`, `\nremoteAddress: ${remoteAddress}`, `\nplatform: ${platform}`, `\nmobile: ${mobile}`, `\nuseragent: ${useragent}`, `\norigin: ${origin}`, `\nlanguage: ${language}`)
        }

        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            res.status(400).send(error.message);
          } else {
            res.status(200).jsonp({success: true});
          }
        })

    } else {
        res.status(400).send({success: false})

    }

  app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
    const status = err.status || 500;
    const message = err.message || err;
    res.status(status).send(message);
  });

});

// app.listen(PORT || 3000); FOR GLITCH
// app.listen(PORT || 3001); FOR LOCALHOST
app.listen(PORT || 3001);
