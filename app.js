const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
  const url = req.url;
  const method = req.method;

  if (url === '/') {
    
    fs.readFile('./message.txt', 'utf8', (err, data) => {
      if (err) console.error(err);
      console.log(data);

      res.setHeader('Content-Type', 'text/html');
      res.write('<html>');
      res.write('<head><title>Enter Message</title></head>');
      res.write('<body>');

      // Display existing messages
      const messages = data ? data.split('+') : [];
      messages.forEach(message => {
        res.write(`${message}`);
      });

      // Form to add new messages
      res.write('<form action="/message" method="POST"><input type="text" name="message"><button type="submit">Send</button></form>');

      res.write('</body>');
      res.write('</html>');
      return res.end();
    });
  } else if (url === '/message' && method === 'POST') {
    const body = [];
    req.on('data', chunk => {
      body.push(chunk);
    });
    req.on('end', () => {
      const parsedBody = Buffer.concat(body).toString();
      const message = parsedBody.split('=')[1];

      // Append new message to the file
      fs.appendFile('message.txt', message + '\n', err => {
        if (err) console.error(err);
        res.statusCode = 302;
        res.setHeader('Location', '/');
        return res.end();
      });
    });
  } else {
    res.setHeader('Content-Type', 'text/html');
    res.write('<html>');
    res.write('<head><title>My First Page</title></head>');
    res.write('<body><h1>Hello from my Node.js Server!</h1></body>');
    res.write('</html>');
    res.end();
  }
});

server.listen(3000);
