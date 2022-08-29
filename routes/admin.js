const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
let Users = require(path.join(__dirname, '../models/index.js')).users;
let Admin = require(path.join(__dirname, '../models/index.js')).admin;
const checkLogin = require('./checkLogin');
const { response } = require('express');

// Signup

router.post('/admin/adminsignup', (req, res) => {
  Admin.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else if (user) {
      res.json({ success: false, message: 'Email already exists' });
    } else {
      let admin = new Admin();
      admin.email = req.body.email;
      admin.password = req.body.password;
      admin.save((err) => {
        if (err) {
          res.json({ success: false, message: err });
        } else {
          res.json({ success: true, message: 'User created' });
        }
      });
    }
  }).select('email');
});

// login admin

router.get('/admin/adminlogin', (req, res) => {
  res.render('adminLogin');
});

router.post('/admin/adminlogin', (req, res) => {
  Admin.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else if (!user) {
      res.json({ success: false, message: 'User not found' });
    } else if (user) {
      if (user.password != req.body.password) {
        res.json({ success: false, message: 'Wrong password' });
      } else {
        const payload = { admin: user.email };
        const token = jwt.sign(payload, 'secret', { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        // res.json({ success: true, message: 'User found', token: token });
        res.redirect('/admin/');
      }
    }
  }).select('email password');
});

// get all data from users collection

router.get('/admin', checkLogin, (req, res) => {
  Users.find({}, function (err, data) {
    if (err) res.json(err);
    else
      res.render('admin', {
        user: data,
      });
  });
});

router.get('/admin/delete/:id', checkLogin, (req, res) => {
  Users.findByIdAndRemove(req.params.id, (err) => {
    if (err) res.json(err);
    else res.redirect('/admin');
  }).select('email password');
});

router.get('/admin/editAdmin/:id', checkLogin, (req, res) => {
  Users.findById(req.params.id, (err, user) => {
    if (!err) {
      res.render('editAdmin', {
        data: user,
      });
    } else {
      req.flash('error', 'User not found');
      res.redirect('/admin');
    }
  });
});

router.post('/admin/editAdmin/:id', checkLogin, (req, res) => {
  Users.findByIdAndUpdate(
    req.params.id,
    {
      email: req.body.email,
      fullname: req.body.fullname,
      address: req.body.address,
      phone: req.body.phone,
      status: req.body.status,
    },
    (err) => {
      if (err) res.json(err);
      else res.redirect('/admin');
    }
  ).select('email password');
});

router.get('/admin_form', (req, res) => {
  res.render('admin_form');
});

module.exports = router;
