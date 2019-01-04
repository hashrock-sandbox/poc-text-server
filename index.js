const connect = require("connect");
const http = require("http");
const serveStatic = require("serve-static");
const fs = require("fs");
const path = require("path");
const app = connect();
const bodyParser = require("body-parser");

app.use(bodyParser.json());
app.use("/api", function(req, res) {
  fs.writeFile(path.join("data", req.body.key), req.body.contents, () => {
    res.setHeader("Content-Type", "application/json");
    const obj = { success: true, key: req.body.key };
    res.end(JSON.stringify(obj));
  });
});

app.use("/files", function(req, res) {
  const dirs = fs.readdirSync("./data");
  res.end(JSON.stringify(dirs));
});

function generateRandomId() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

app.use(serveStatic("./public/"));
http.createServer(app).listen(3000);
