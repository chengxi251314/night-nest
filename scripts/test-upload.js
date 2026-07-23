// Test avatar upload
const fs = require("fs");
const path = require("path");
const http = require("http");

const boundary = "----FormBoundary" + Math.random().toString(36).slice(2);
const filePath = "F:/自媒体/night-nest/apps/web/public/characters/luoyin.png";
const fileContent = fs.readFileSync(filePath);
const filename = "test-upload.jpg";

const body = Buffer.concat([
  Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${filename}"\r\nContent-Type: image/jpeg\r\n\r\n`),
  fileContent,
  Buffer.from(`\r\n--${boundary}--\r\n`)
]);

const req = http.request({
  hostname: "localhost",
  port: 3100,
  path: "/v1/auth/avatar",
  method: "POST",
  headers: {
    "Content-Type": "multipart/form-data; boundary=" + boundary,
    "Content-Length": body.length
  }
}, (res) => {
  let data = "";
  res.on("data", chunk => data += chunk);
  res.on("end", () => {
    console.log("Status:", res.statusCode);
    console.log("Response:", data);
  });
});
req.on("error", e => console.error("Error:", e.message));
req.write(body);
req.end();
