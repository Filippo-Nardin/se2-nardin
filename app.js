const express = require('express'),
   bodyParser = require('body-parser');

var checker = require('./checker.js');

// instantiate express
const app = express();
var router = express.Router();

//Configure bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// set our port
var port = process.env.PORT || 5000;




// a useless function that returns a fixed object. you can use it, if you want, for testing purposes
app.get('/count',function (req, res) {
    res.json({count: 3})
})

router.post('/check', function (req, res) {        
        console.log('\n');
        console.log('POST received');
        
        //Ottieni parametri dal client
        var url = req.body.url;
        var invocationParameters = req.body.invocationParameters;
        var expectedResultData = req.body.expectedResultData;
        var expectedResultStatus = req.body.expectedResultStatus;

        var tmp = {};
        tmp.url = url;
        tmp.invocationParameters = invocationParameters;
        tmp.expectedResultData = expectedResultData;
        tmp.expectedResultStatus = expectedResultStatus;
        console.log(tmp);
        
        checker.check(url, invocationParameters, expectedResultData, expectedResultStatus)
        .then(out => {
            console.log(out);
            res.send(out);
            res.end();
        });        
    });

// middleware route to support CORS and preflighted requests
app.use(function (req, res, next) {
    // do logging
    console.log('Something is happening.');
    //Enabling CORS
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Content-Type', 'application/json');
    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, DELETE');
        return res.status(200).json({});
    }
    // make sure we go to the next routes
    next();
});

// register our router on /
app.use('/', router);

// handle invalid requests and internal error
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({ error: { message: err.message } });
});

//Start listening on port
app.listen(port, function () {
    console.log('App listening on port ' + port);
});