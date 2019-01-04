const connect = require("connect");
const http = require("http");
const serveStatic = require("serve-static");
const fs = require("fs");
const path = require("path");
const app = connect();
const bodyParser = require("body-parser");

app.use(bodyParser.json());

function writeFile(key, contents) {
  fs.writeFileSync(path.join("data", key), contents);
  const result = { success: true, key };
  return result;
}
function readFile(key) {
  let data = fs.readFileSync(path.join("data", key), "utf-8");
  const result = { key, data };
  return result;
}

app.use("/api", function(req, res, next) {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  next();
});

function listFiles() {
  const dirs = fs.readdirSync("./data");
  let fileobjs = [];
  //更新日を収集
  dirs.forEach(element => {
    var stats = fs.statSync(path.join("data", element));
    fileobjs.push({
      name: element,
      mtime: stats.mtime.getTime()
    });
  });
  return fileobjs;
}

function getId(url) {
  return url.slice(1);
}

function checkExist(id) {
  const dirs = fs.readdirSync("./data");
  return dirs.indexOf(id) >= 0;
}

app.use("/api/files", function(req, res) {
  let result = {
    success: false
  };

  if (req.url === "/") {
    result = listFiles();
  } else {
    const id = getId(req.url);
    const isExist = checkExist(id);

    if (req.method === "POST") {
      if (isExist) {
        result = writeFile(id, req.body.contents);
      } else {
        const random = generateRandomId();
        result = writeFile(random, req.body.contents);
      }
    }
    if (req.method === "GET") {
      if (isExist) {
        result = readFile(id);
      }
    }
  }
  res.end(JSON.stringify(result));
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
