const { error } = require('console');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
let checkAuthenticated = require('./functions.js').checkAuthenticated;

// contact and feedback
router.get('/contact', checkAuthenticated, (req, res) => {
    res.render('contact');
})

router.post('/contact', checkAuthenticated, (req, res) => {
    
})

module.exports = router;
