const mongoose = require("mongoose")
    //限制类型
const Schema = mongoose.Schema
const UserType = {
    username: String,
    password: String,
    age: Number,
    avatar: String
}
const UserModel = mongoose.model("user", new Schema(UserType))
    //模型user将会对应users集合
module.exports = UserModel