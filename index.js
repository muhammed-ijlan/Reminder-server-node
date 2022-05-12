const express = require("express");

const app = express();
app.use(express.json());
const dataServices = require("./services/data.service");

const cors = require("cors");

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

//register
app.post("/register", (req, res) => {
  dataServices
    .register(req.body.uname, req.body.uid, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login
app.post("/login", (req, res) => {
  dataServices.login(req.body.uid, req.body.password).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//add event
app.post("/dashboard", (req, res) => {
  dataServices.addEvent(req.body.uid, req.body.events).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

app.post("/event", (req, res) => {
  dataServices.events(req.body.uid).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
