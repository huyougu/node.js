const UserService = require("../services/UserService");
const JWT = require("../util/jwt");

const UserController = {
    addUser: async(req, res) => {
        console.log(req.body, req.file);
        const avatar = req.file ? `/uploads/${req.file.filename}` : `/images/default.png`
        const { username, password, age } = req.body
        await UserService.addUser(username, password, age, avatar)
        res.send({
            ok: 1
        })
    },

    updateUser: async(req, res) => {
        // console.log(req.body, req.params.myid);
        console.log(req.body, req.params.myid);
        const { username, password, age } = req.body
        await UserService.updateUser(req.params.myid, username, age, password)
        res.send({
            ok: 1
        })
    },

    deleteUser: async(req, res) => {
        await UserService.deleteUser(req.params.id)
        res.send({
            ok: 1
        })
    },
    getUser: async(req, res) => {
        console.log(req.query);
        const { page, limit } = req.query
        const data = await UserService.getUser(page, limit)
        res.header("Access-Control-Allow-Origin", "*")
        res.send(data)
    },
    login: async(req, res) => {
        const { username, password } = req.body
        const data = await UserService.login(username, password)
        if (data.length === 0) {
            res.send({
                ok: 0
            })
        } else {
            //设置token
            console.log(data[0]);
            const token = JWT.generate({
                    _id: data[0]._id,
                    username: data[0].username
                }, "1h")
                //token返回在header
            res.header("Authorization", token)
                // req.session.user = data[0]
            res.send({
                ok: 1
            })
        }
    },
    logout: (req, res) => {
        req.session.destroy(() => {
            res.send({
                ok: 1
            })
        })
    }


}
module.exports = UserController