var express = require('express');
const UserController = require('../controllers/Usercontroller');
const UserModel = require('../model/UserModel');
var router = express.Router();
const multer = require("multer")
const upload = multer({ dest: 'public/uploads' })

/* GET users listing. */
router.get('/', function(req, res, next) {
    res.send('respond with a resource');
});
//响应前端post请求
router.post("/user", upload.single("avatar"), UserController.addUser)
    // upload.array("avatar",10)接受多张图片
    //动态路由获取id
router.put("/user/:myid", UserController.updateUser)
router.delete("/user/:id", UserController.deleteUser)

router.get("/user", UserController.getUser)
router.get("/logout", UserController.logout)

//登录校验
router.post("/login", UserController.login)

module.exports = router;
/**
 * 
 * @api {post} /api/user user
 * @apiName addUser
 * @apiGroup usergroup

 * username, password, age, avatar
 * @apiParam  {String} username 用户名
 * @apiParam  {String} password 密码
 * @apiParam  {Number} age 年龄
 * @apiParam  {File} avatar 头像
 * 
 * @apiSuccess (200) {Number} ok 标识成功字段
 * 
 * @apiParamExample  {multipart/form-data} Request-Example:
 * {
 *     username : "pjh",
 *     password:"123",
 *     age:100,
 *     avatar: File
 * }
 * 
 * 
 * @apiSuccessExample {json} Success-Response:
 * {
 *     ok : 1
 * }
 * 
 * 
 */