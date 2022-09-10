var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    //判断req.session.user

    res.render('index', { title: 'Express' });

});

// var JWT = require("../util/jwt")
// const token = JWT.generate({ name: "kerwin" }, "10s")
// console.log(JWT.verify(token));
// setTimeout(() => {
//     console.log(JWT.verify(token));
// }, 9000)
// setTimeout(() => {
//     console.log(JWT.verify(token));
// }, 11000)

module.exports = router;