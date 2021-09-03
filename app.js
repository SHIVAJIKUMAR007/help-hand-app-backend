const express = require("express");
const app = express();
const fileUpload = require("express-fileupload");
const path = require("path");
var bodyParser = require("body-parser");
require("./db"); // connect to db
const authRouter = require("./routes/auth");
const banRouter = require("./routes/ban");
const provideRouter = require("./routes/provide");
const searchRouter = require("./routes/search");
const requestRouter = require("./routes/request");
const reccomandRouter = require("./routes/reccomand");
const reportRouter = require("./routes/report");
const emailVarifyRouter = require("./routes/emailVarify");
//tcp connection for realtime chat
const server = require("http").createServer(app);
const io = require("socket.io")(server, { cors: { origin: "*" } });
require("./routes/chat")(io);
//tcp connection for realtime chat

// middlewares
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());
app.use((req, res, next) => {
  // api access by origin
  res.setHeader("Access-Control-Allow-Origin", "*"),
    res.setHeader("Access-Control-Allow-Headers", "*"),
    next();
});
app.use("/api/auth", authRouter);
app.use("/api/ban", banRouter);
app.use("/api/provide", provideRouter);
app.use("/api/request", requestRouter);
app.use("/api/search", searchRouter);
app.use("/api/reccomand", reccomandRouter);
app.use("/api/report", reportRouter);
app.use("/api/emailVarify", emailVarifyRouter);

// Routers
app.get("/", (req, res) => {
  res.send("backend for dasp app is prepaired");
});

// listen
server.listen(process.env.PORT || 5000, () => {
  console.log(
    "Help Hand Backend server is running on port " + (process.env.PORT || 5000)
  );
});
