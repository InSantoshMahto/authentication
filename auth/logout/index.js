'use strict'

// import 
const jwtSimple = require('jwt-simple');

let logout = (req, res) => {
    // clearing the cookies
    res.clearCookie('clientId', { path: '/' });
    res.clearCookie('password', { path: '/' });

    // clearing the session
    console.log(req.session.userId, req.session.userName, req.session.password);

    console.log(req.session);
    req.session.destroy(function(err) {
        if (!err) {
            // cannot access session here
            res.send({
                password: 'logout'
            });
        }
    })
}

/* ==================== Export ====================  */
module.exports = {
    logout: logout
};