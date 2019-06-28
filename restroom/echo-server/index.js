const express = require('express');
const fetch = require('node-fetch');
const app = express();

const port = process.env.PORT || 3000;

app.get("/", function(req, res) {

      console.log(">> ", req.originalUrl);
      console.log(">> ", req.connection.remoteAddress);
      fetch("https://hooks.zapier.com/hooks/catch/1572345/vf4gz5/",
        {
            method: "POST",
            body: JSON.stringify({a:1}),
        });
        
      res.close();

    });


const server = app.listen(port, "0.0.0.0");

server.setTimeout(2 * 60 * 1000);

console.log('started on ' + port);
