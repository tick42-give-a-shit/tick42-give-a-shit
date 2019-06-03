const express = require('express');

const app = express();

const port = process.env.PORT || 3000;

app.get("/", function(req, res) {

      console.log(">> ", req.originalUrl);
      console.log(">> ", req.connection.remoteAddress);

    });


const server = app.listen(port, "0.0.0.0");

server.setTimeout(2 * 60 * 1000);

console.log('started on ' + port);
