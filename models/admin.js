const mongoose = require('./db.js');
const Schema = mongoose.Schema;

const adminSchema = new Schema(
  {
    fullname: String,
    email: String,
    password: String,
    address: String,
    phone: String,
    status: String,
  },
  { collection: 'admin' }
);

let Admin = mongoose.model('admin', adminSchema);

module.exports = Admin;
