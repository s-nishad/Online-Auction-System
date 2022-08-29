const { error } = require('console');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const path = require('path');
let Items = require(path.join(__dirname, '../models/index.js')).items;
let Category = require(path.join(__dirname, '../models/index.js')).categories;
let checkAuthenticated = require('./functions.js').checkAuthenticated;

router.get('/seller_view', checkAuthenticated, function(req, res) {
    Items.find({}, function(err, data) {
        if (err) res.json(err);
        else res.render('seller_view', {
            item: data
        });
    });
    Category.find({}, function(err, data) {
        if (err) res.json(err);
        else res.render('seller_view', {
            category: data
        });
    });
});

module.exports = router;
