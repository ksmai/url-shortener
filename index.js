'use strict';
const server = require('./src/server/server.js');
const config = require('./config.json');
const port = process.env.PORT || config.PORT || 3000;
server.listen(port, function() {
  console.log(`Listening on port ${port}`);
  console.log(`PID: ${process.pid}`);
});
