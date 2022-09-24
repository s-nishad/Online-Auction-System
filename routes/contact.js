const { error } = require('console');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
const nodemailer = require('nodemailer');
let checkAuthenticated = require('./functions.js').checkAuthenticated;

// contact and feedback
router.get('/contact', checkAuthenticated, (req, res) => {
  res.render('contact');
});

// send feedback to admin email
router.post('/contact', checkAuthenticated, (req, res) => {
  let name = req.body.name;
  let clint_mail = req.body.email;
  let contact = req.body.contact;
  let message = req.body.message;

  let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.MAIL_NAME,
      pass: process.env.MAIL_PASS,
    },
  });

  let mailOptions = {
    from: '"' + name + '" <' + clint_mail + '>',
    to: process.env.SENT_MAIL,
    subject: 'Feedback from ' + name,
    text: 'Contact: ' + contact + '\n\nMessage: ' + message,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      req.flash('error', 'Something went wrong');
    } else {
      console.log('Email sent: ' + info.response);
      req.flash('success', 'Email sent successfully');
      res.redirect('/contact');
    }
  });
});

module.exports = router;
