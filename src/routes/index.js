const { Router } = require('express');
const { createEmail } = require('../controller/controller');
require('dotenv').config();

const router = Router();

router.post('/', async (req, res) => {
  const { name, message } = req.body;

  try {    
    let createEmailResponse = await createEmail({ req: req, name: name, message: message })
    createEmailResponse.transporter.sendMail(createEmailResponse.mailOptions, (error, info) => {
    if (error) res.status(400).send(error.message);
    else res.status(200).json({ success: true });
    })
  } catch(e) { res.status(400).send({ success: false }) }
});

module.exports = router;