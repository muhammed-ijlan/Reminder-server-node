const express = require("express");

const app = express();
app.use(express.json());
const dataServices = require("./services/data.service");

const cors = require("cors");
const jwt = require("jsonwebtoken");

app.use(
  cors({
    origin: "http://localhost:4200",
  })
);

//middleware
const jwtMiddleWare = (req, res, next) => {
  try {
    const token = req.headers["access-token"];
    const data = jwt.sign(token, "SuperSecret");
    req.currentUid = data.currentUid;
    next();
  } catch (err) {
    res.status(401).json({
      status: false,
      message: "Please logIn",
    });
  }
};

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
app.post("/dashboard", jwtMiddleWare, (req, res) => {
  dataServices.addEvent(req.body.uid, req.body.events).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

app.post("/event", jwtMiddleWare, (req, res) => {
  dataServices.events(req.body.uid).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

app.delete("/event/delete/:uid/:eid", jwtMiddleWare, (req, res) => {
  dataServices.deleteEvent(req.params.uid, req.params.eid).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

app.delete("/deleteUid/:uid", jwtMiddleWare, (req, res) => {
  dataServices.deleteUser(req.params.uid).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

// app.patch("/event/edit/:uid/:id", (req, res) => {
//   dataServices
//     .editEvent(req.params.uid, req.params.id, req.body.eventName)
//     .then((result) => {
//       res.status(result.statusCode).json(result);
//     });
// });

const port = 3000;
app.listen(port, () => {
  console.log(`App is running on ${port}`);
});
