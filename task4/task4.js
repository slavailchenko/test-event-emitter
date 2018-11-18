const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

// app.all('*', (req, res, next) => {
//     setTimeout(() => next(), 80000);
// });

app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));

app.get('/cars', ((req, res, next) => {
    if (req.path == '/cars') {
        const src = fs.createReadStream('../task3/cars1.json');
        src.pipe(res);
    } else {
        next();
    }
})
);

app.listen(8081, err => {
    if (err) {
        console.log('Server creation error: ' + err);
        return;
    }
    console.log(`Server started on port`);
}).setTimeout(1800000);