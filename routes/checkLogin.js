const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.redirect('/admin/adminlogin');
    } else {
        jwt.verify(token, 'secret', (err, decoded) => {
        if (err) {
            res.redirect('/admin/adminlogin');
        } else {
            next();
        }
        });
    }
}

module.exports = checkLogin;