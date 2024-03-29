const fs = require("fs");
const reqhandler = (req, res) => {
  const url = req.url;
  const method = req.method;
  if (url === "/") {
    res.write("<html>");
    res.write("<head><title>enter message</title></head>");
    res.write(
      "<body><form action='/message' method='POST'><input type='text' name='test'><button type='submit'>send</button></form></body>"
    );
    res.write("</html>");
    return res.end();
  }
  if (url === "/message" && method === "POST") {
    const body = [];
    req.on("data", (chunk) => {
      console.log(chunk);
      body.push(chunk);
    });
    req.on("end", () => {
      const parsedbody = Buffer.concat(body).toString();
      console.log(parsedbody);
      const msg = parsedbody.split("=")[1];
      fs.writeFileSync("message.txt", msg);
      res.statusCode = 302;
      res.setHeader("Location", "/");
      return res.end();
    });
  }
  res.setHeader("Content-Type", "text/html");
  res.write("<html>");
  res.write("<head><title>my first page</title></head>");
  res.write("<body><h1>hello world</h1></body>");
  res.write("</html>");
  res.end();
};

module.exports = reqhandler;
