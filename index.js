const connect = require("connect");
const http = require("http");
const serveStatic = require("serve-static");
const fs = require("fs");
const path = require("path");
const app = connect();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

function writeFile(res, key, contents) {
  fs.writeFile(path.join("data", key), contents, () => {
    const obj = { success: true, key };
    res.end(JSON.stringify(obj));
  });
}
function readFile(res, key) {
  let data = fs.readFileSync(path.join("data", key), "utf-8");
  const obj = { key, data };
  res.end(JSON.stringify(obj));
}

app.use("/api", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

app.use("/api/load", function(req, res) {
  const dirs = fs.readdirSync("./data");
  if (dirs.indexOf(req.body.key) >= 0) {
    readFile(res, req.body.key);
  }
});

function listFiles() {
  const dirs = fs.readdirSync("./data");
  let fileobjs = [];
  dirs.forEach(element => {
    var stats = fs.statSync(path.join("data", element));
    fileobjs.push({
      name: element,
      mtime: stats.mtime.getTime()
    });
  });
  return fileobjs;
}

app.use("/api/files", function(req, res) {
  if (req.url === "/") {
    res.end(JSON.stringify(listFiles()));
  } else {
    const id = req.url.slice(1);
    const dirs = fs.readdirSync("./data");
    const isExist = dirs.indexOf(id) >= 0;
    if (req.method === "POST") {
      if (isExist) {
        writeFile(res, id, req.body.contents);
      } else {
        const random = generateRandomId();
        writeFile(res, random, req.body.contents);
      }
    }
    if (req.method === "GET") {
      if (isExist) {
        readFile(res, id);
      }
    }
  }
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
