const app = require("./app");

const { HOSTNAME, PORT, ROOT_PATH } = process.env;
const hostname = HOSTNAME || "127.0.0.1";
const port = PORT || 3001;
const rootPath = ROOT_PATH || "/";

const server = app.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}${rootPath}`);
});

module.exports = server;
