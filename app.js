var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var loginRouter = require('./routes/login');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var uploadRouter = require('./routes/upload');
var chatRouter = require('./routes/chat');
var JWT = require("./util/jwt")
const multer = require('multer')
const upload = multer({ dest: 'public/uploads/' })

var session = require("express-session")
const MongoStore = require("connect-mongo")
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// //注册session中间件
// app.use(session({
//     name: "pjhsystem",
//     secret: "16dawd", //密钥
//     cookie: {
//         maxAge: 1000 * 60 * 60, //多久过期，一个小时
//         secure: false, //为true时表示只有HTTP协议才能访问cookie
//     },
//     resave: true, //过期时间重新计时
//     saveUninitialized: true,
//     store: MongoStore.create({
//         mongoUrl: "mongodb://127.0.0.1:27017/kerwin_session", //新创建一个数据库
//         ttl: 1000 * 60 * 60 //与过期时间保持一致 
//     })
// }))

// //设置中间件，session过期校验
app.use((req, res, next) => {
        //排除login相关的路由接口
        if (req.url.includes("login")) {
            next()
            return
        }
        const token = req.headers["authorization"] && req.headers["authorization"].split(" ")[1]
        if (token) {
            console.log(token);
            const payload = JWT.verify(token)
            if (payload) {
                const newToken = JWT.generate({
                    _id: payload._id,
                    username: payload.username
                }, "1h")
                res.header("Authorization", newToken)
                next()
            } else {
                res.status(401).send({ errCode: -1, errInfo: "token过期" })
            }
        } else {
            next()
        }
    })
    //     if (req.session.user) {
    //         //重新设置一下session
    //         req.session.date = Date.now()
    //             //改变session过期时间重新计算
    //         next()
    //     } else {
    //         req.url.includes("api") ? res.status(401).send({ ok: 0 }) : res.redirect("/login")
    //     }
    // })

app.use('/home', indexRouter);
app.use('/api', usersRouter);
app.use('/login', loginRouter);
app.use("/upload", uploadRouter)
app.use("/chat", chatRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;