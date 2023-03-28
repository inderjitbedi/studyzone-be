const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const authRoute = require('./routes/authRoute')
const adminRoute = require('./routes/adminRoute')
const swagger = require('./swagger');

dotenv.config();

const app = express();
app.use(express.json());

var originsWhitelist = [
    '*',
    'http://localhost:4200',
];
var corsOptions = {
    origin: function (origin, callback) {
        var isWhitelisted = originsWhitelist.indexOf(origin) !== -1;
        // callback(null, isWhitelisted);
        callback(null, true);
    },
    credentials: true
}
app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

swagger(app);

mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.on("connected", () => {
    console.log("Connected to DB");
});
mongoose.connection.on("error", err => {
    console.log("DB connection failed: ", err);
});

app.use('/api/auth', authRoute);
app.use('/api/admin', adminRoute);
app.use("/temp",express.static(path.join(__dirname, 'temp')));
app.use("/slide",express.static(path.join(__dirname, 'uploads')));
app.use("/",express.static(path.join(__dirname, 'public')));

app.listen(3005, () => {
    console.log('Server started on port 3005');
});
