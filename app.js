const express = require('express')
const app = express();
const connectDB = require('./src/config/DB_config');
const session = require('express-session');

// express config
connectDB();

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use('/public', express.static(__dirname + '/public'))

app.set('view engine', 'ejs');
app.set('views', __dirname + '/src/views')

// session
const sess = {
    secret: "test",
    cookie: {}
}


if(app.get('env') == 'production'){
    app.set('trust proxy', 1);
    sess.cookie.secure = true;
}

app.use(session(sess))
// api router
app.use('/api/v1', require('./src/routers/todoRouter'))











// page router
app.get('/', (req, res) => {
    console.log(req.session.id)
    res.render('index')
})


// server connection
const PORT = process.env.PORT || 5000
app.listen(PORT,() => console.log(`app running on PORT: ${PORT}`))