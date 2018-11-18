const express = require('express');
const app = express();
const fs = require('fs');
const server = require('http').createServer(app);

// app.all('*', (req, res, next) => {
//     setTimeout(() => next(), 80000);
// });

app.get('/cars', ((req, res, next) => {
    if (req.path == '/cars') {
        const src = fs.createReadStream('cars.json');
        src.pipe(res);
    } else {
        next();
    }
})
);

server.listen(8081, err => {
    if (err) {
        console.log('Server creation error: ' + err);
        return;
    }
    console.log(`Server started on port`);
}).setTimeout(1600000);