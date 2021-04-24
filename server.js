var express = require('express');
var config = require('./config/config');
var app = express();
var cors = require('cors');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var router = require('./routers/Routes');
var path = require('path')
var port = process.env.PORT || 5000;
mongoose.Promise = Promise;
// connect to mongo db
const mongoUri = config.mongoUri;
mongoose.connect(mongoUri, { server: { socketOptions: { keepAlive: 1 } } });
mongoose.connection.on('error', () => {
    throw new Error(`unable to connect to database: ${mongoUri}`);
});
// print mongoose logs in dev env
if (config.MONGOOSE_DEBUG) {
    mongoose.set('debug', (collectionName, method, query, doc) => {
        debug(`${collectionName}.${method}`, util.inspect(query, false, 20), doc);
    });
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var corsOption = {
    origin: true,
    methods: 'GET, HEAD,PUT,POST,PATCH,DELETE',
    credentials: true,
    exposedHeaders: ["Access-Control-Allow-Origin", "Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, access-token"]
}

app.get('/forgotpassword', function (req, res) {
    res.sendFile(__dirname + "/public/Reset/" + "index.html");
})


app.get('/chat', (req, res) => {
    res.sendFile(__dirname + "/public/chatbot/" + "index.html");
})

app.use(cors(corsOption));

app.use(express.static(path.join(__dirname + '/')));

config.appRoot = __dirname;
app.use((req, res, next) => {
    next()
})

app.use('/', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, access-token");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE,OPTIONS");
    next();
});

app.use('/api/v1', router);

app.route('/')
    .get(function (req, res) {
        return res.status(200).json({ message: "Welcome to admin apis" });
    });
app.listen(port, () => {
    console.log('Server is running on port ---->', port);
})