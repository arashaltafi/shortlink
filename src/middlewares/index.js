const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

module.exports = (app) => {
    app.use(cors());
    app.use(bodyParser.json());
    app.use(cookieParser());
}