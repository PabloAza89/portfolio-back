const nodemailer = require("nodemailer");
const { G_USER, G_PASS, G_TO } = process.env;

const createEmail = async (props) => {
  
  let forwarded = props.req.headers['x-forwarded-for'] || 'no data';
  let peernameSocket = props.req.socket['_peername'] || 'no data';
  let remoteAddress = JSON.stringify(props.req.socket.remoteAddress) || 'no data';
  let platform = props.req.headers['sec-ch-ua-platform'] || 'no data';
  let mobile = props.req.headers['sec-ch-ua-mobile'] || 'no data';
  let useragent = props.req.headers['user-agent'] || 'no data';
  let origin = props.req.headers['origin'] || 'no data';
  let language = props.req.headers['accept-language'] || 'no data';

  var transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: G_USER,
      pass: G_PASS
    }
  })

  var mailOptions = {
    to: G_TO,
    subject: props.name,
    text: props.message.concat(
      `\n\nforwarded: ${forwarded}`,
      `\npeernameSocket: ${JSON.stringify(peernameSocket)}`,
      `\nremoteAddress: ${remoteAddress}`,
      `\nplatform: ${platform}`,
      `\nmobile: ${mobile}`,
      `\nuseragent: ${useragent}`,
      `\norigin: ${origin}`,
      `\nlanguage: ${language}`
    )
  }
  
  return {
    transporter: transporter,
    mailOptions: mailOptions
  }
}

module.exports = { createEmail }