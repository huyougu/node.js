const JWT = require("../util/jwt")

function start(server) {
    const io = require('socket.io')(server);

    io.on('connection', (socket) => {
        // console.log("111", socket.handshake.query.token);
        const payload = JWT.verify(socket.handshake.query.token)
        if (payload) {
            socket.user = payload
            socket.emit(WebSocketType.GroupChat, createMessage(null, "欢迎来到聊天室"))
            sendAll(io)
        } else {
            socket.emit(WebSocketType.Error, createMessage(null, "token过期"))
        }

        socket.on(WebSocketType.GroupList, () => {
            console.log(Array.from(io.sockets.sockets).map(item => item[1].user));
        })
        socket.on(WebSocketType.GroupChat, (msg) => {
            console.log(msg);
            //给所有人发
            io.sockets.emit(WebSocketType.GroupChat, createMessage(socket.user, msg.data))
                //给除了自己的所有人发
                // socket.broadcast.emit(WebSocketType.GroupChat, createMessage(socket.user, msg.data))
        })
        socket.on(WebSocketType.SingleChat, (msgObj) => {
            Array.from(io.sockets.sockets).forEach(item => {
                if (item[1].user.username == msgObj.to) {
                    item[1].emit(WebSocketType.SingleChat, createMessage(socket.user, msgObj.data))
                }
            })
        })
        socket.on("disconnect", () => {
            sendAll(io)
        })



    });
}




const WebSocketType = {
    Error: 0, //错误
    GroupList: 1,
    GroupChat: 2,
    SingleChat: 3

}

function createMessage(user, data) {
    return {
        user,
        data
    }
}

function sendAll(io) {

    io.sockets.emit(WebSocketType.GroupList, createMessage(null, Array.from(io.sockets.sockets).map(item => item[1].user).filter(item => item)))
        //过滤掉空数组
}
module.exports = start