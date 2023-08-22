const http = require('http');
const rout=require('./routes');

const server = http.createServer(rout);

server.listen(3000);
