const UserModel = require("../model/UserModel")
const UserService = {
    addUser: (username, password, age, avatar) => {
        return UserModel.create({
                username,
                password,
                age,
                avatar

            })
            //插入数据库
            //1.创建一个模型（user）,一一对应数据库的集合(users)
            //user.create user.find user.delete user.update
    },

    updateUser: (_id, username, age, password) => {
        return UserModel.updateOne({ _id: _id }, {
            username,
            password,
            age
        })
    },
    deleteUser: (_id) => {
        return UserModel.deleteOne({
            _id: _id
        })
    },
    getUser: (page, limit) => {
        return UserModel.find({}, ["username", "age", "avatar"]).sort({ age: -1 }).skip((page - 1) * limit).limit(limit)
    },
    login: (username, password) => {
        return UserModel.find({ username, password })
    }
}
module.exports = UserService