const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const path = require('path');
const bcrypt = require('bcryptjs');
let Users = require(path.join(__dirname, '../models/index.js')).users;
let Admin = require(path.join(__dirname, '../models/index.js')).admin;
let Items = require(path.join(__dirname, '../models/index.js')).items;
let Category = require(path.join(__dirname, '../models/index.js')).categories;
const checkLogin = require('./checkLogin');

// Add Admin

router.get('/admin/addAdmin', checkLogin, (req, res) => {
  res.render('addAdmin');
});

router.post('/admin/addAdmin', checkLogin, (req, res) => {
  Admin.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else if (user) {
      res.json({ success: false, message: 'Email already exists' });
    } else {
      let admin = new Admin();
      admin.fullname = req.body.fullname;
      admin.email = req.body.email;
      admin.password = req.body.password;
      admin.password2 = req.body.password2;
      admin.phone = req.body.phone;
      admin.address = req.body.address;
      admin.status = req.body.status;
      if (admin.password !== admin.password2) {
        res.json({ success: false, message: 'Passwords do not match' });
      } else {
        admin.save((err) => {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            req.flash('success', 'Admin added successfully');
            res.redirect('/admin');
          }
        });
      }
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
      // res.json({ success: false, message: err });
      req.flash('error', 'Something went wrong');
      res.redirect('/admin/adminlogin');
    } else if (!user) {
      // res.json({ success: false, message: 'User not found' });
      req.flash('error', 'User not found');
      res.redirect('/admin/adminlogin');
    } else if (user) {
      if (user.password != req.body.password) {
        // res.json({ success: false, message: 'Wrong password' });
        req.flash('error', 'Wrong password');
        res.redirect('/admin/adminlogin');
      } else {
        const payload = { admin: user.email };
        const token = jwt.sign(payload, 'secret', { expiresIn: '24h' });
        res.cookie('token', token, { httpOnly: true });
        // res.json({ success: true, message: 'User found', token: token });
        res.redirect('/admin');
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
    req.flash('success', 'User deleted successfully');
  }).select('email password');
});

router.get('/admin/editAdmin/:id', checkLogin, (req, res) => {
  Users.findById(req.params.id, (err, user) => {
    if (!err) {
      res.render('editAdmin', {
        data: user,
      });
    } else {
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
      password: bcrypt.hashSync(req.body.password, 10),
      password2: bcrypt.hashSync(req.body.password2, 10),
    },
    (err) => {
      if (err) res.json(err);
      else res.redirect('/admin');
      req.flash('success', 'User updated');
    }
  ).select('email password');
});

// add user by admin

router.get('/admin/addUser', checkLogin, (req, res) => {
  res.render('addUser');
});

router.post('/admin/addUser', checkLogin, (req, res) => {
  Users.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      res.json({ success: false, message: err });
    } else if (user) {
      res.json({ success: false, message: 'Email already exists' });
    } else {
      let user = new Users();
      user.email = req.body.email;
      //bycrypt password
      user.password = bcrypt.hashSync(req.body.password, 10);
      user.password2 = bcrypt.hashSync(req.body.password2, 10);
      user.fullname = req.body.fullname;
      user.address = req.body.address;
      user.phone = req.body.phone;
      user.status = req.body.status;
      if (req.body.password != req.body.password2) {
        res.json({ success: false, message: 'Password not match' });
      } else {
        user.save((err) => {
          if (err) {
            res.json({ success: false, message: err });
          } else {
            res.redirect('/admin');
            req.flash('success', 'User added');
          }
        });
      }
    }
  });
});

// Admin Info

router.get('/admin_form', checkLogin, (req, res) => {
  Admin.find({}, (err, data) => {
    if (err) res.json(err);
    else
      res.render('admin_form', {
        user: data,
      });
  });
});

// Admin info delete

router.get('/admin_form/delete/:id', checkLogin, (req, res) => {
  Admin.findByIdAndRemove(req.params.id, (err) => {
    if (err) res.json(err);
    else res.redirect('/admin_form');
  }).select('email password');
});

//logout admin
router.get('/admin/logout', (req, res) => {
  res.clearCookie('token');
  res.redirect('/admin/adminlogin');
});

// Product info

router.get('/adminProduct', checkLogin, function (req, res) {
  Items.find({}, function (err, data) {
    if (err) res.json(err);
    else
      res.render('adminProduct', {
        item: data,
      });
  });
  // Category.find({}, function (err, data) {
  //   if (err) res.json(err);
  //   else
  //     res.render('adminProduct', {
  //       category: data,
  //     });
  // });
});

// product info edit

router.get('/adminProduct/edit/:id', checkLogin, (req, res) => {
  Items.findById(req.params.id, (err, item) => {
    if (!err) {
      res.render('editProduct', {
        data: item,
      });
    } else {
      res.redirect('/adminProduct');
    }
  });
});

router.post('/adminProduct/edit/:id', checkLogin, (req, res) => {
  Items.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      price: req.body.price,
      detail: req.body.detail,
    },
    (err) => {
      if (err) {
        console.log(err);
        res.json(err);
      } else {
        res.redirect('/adminProduct');
      }
    }
  ).select('name price description');
});

// Admin Product delete

router.get('/adminProduct/delete/:id', checkLogin, (req, res) => {
  Items.findByIdAndRemove(req.params.id, (err) => {
    if (err) res.json(err);
    else res.redirect('/adminProduct');
    req.flash('success', 'Product deleted');
  }).select('email password');
});


// make isApproved false to true

router.get('/admin/isApproved/:id', checkLogin, (req, res) => {
  Users.findByIdAndUpdate(
    req.params.id,
    {
      isApproved: true,
    },
    (err) => {
      if (err) res.json(err);
      else res.redirect('/admin');
      req.flash('success', 'User approved');
    }
  ).select('email password');
})

// make product status true

router.get('/adminProduct/status/:id', checkLogin, (req, res) => {
  Items.findByIdAndUpdate(
    req.params.id,
    {
      status: true,
    },
    (err) => {
      if (err) res.json(err);
      else res.redirect('/adminProduct');
      req.flash('success', 'Product approved');
    }
  ).select('email password');
})



module.exports = router;
