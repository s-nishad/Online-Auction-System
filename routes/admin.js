const { error } = require('console');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
let Users = require(path.join(__dirname, '../models/index.js')).users;
//let checkAuthenticated = require('./functions.js').checkAuthenticated;

router.get('/admin', (req, res) => {
  Users.find({}, function(err, data) {
    if (err) res.json(err);
    else res.render('admin', {
      user: data
    });
  });
});

// GET A DATA BY ID
router.get('/admin/:id', (req, res) => {
  Users.findOne({ _id: req.params.id }, (err, data) => {
    if (err) {
      res.status(500).json({
        error: 'There was a serverside error!',
      });
    } else {
      res.status(200).json({
        result: data,
        message: 'Success',
      });
    }
  });
});

// POST DATA
router.post('/admin', (req, res) => {
  allUsers = new Users(req.body);
  allUsers.save((err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a serverside error!',
      });
    } else {
      res.status(200).json({
        message: 'User Details are added successfully',
      });
    }
  });
});

// POST MULTIPLE DATA
router.post('/admin/all', async (req, res) => {});

// PUT DATA
router.put('/admin/:id', async (req, res) => {
  await Users.updateOne(
    { _id: req.params.id },
    {
      $set: {},
    },
    (err) => {
      if (err) {
        res.status(500).json({
          error: 'There was a serverside error!',
        });
      } else {
        res.status(200).json({
          message: 'Updated Succesfully',
        });
      }
    }
  );
});

// DELETE DATA
router.delete('/delete/:id', (req, res) => {
  Users.deleteOne({ _id: req.params.id }, (err) => {
    if (err) {
      res.status(500).json({
        error: 'There was a serverside error!',
      });
    } else {
      res.status(200).json({
        message: 'Deleted Succesfully',
      });
    }
  });
});

module.exports = router;
