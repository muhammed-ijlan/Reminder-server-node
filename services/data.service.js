const jwt = require("jsonwebtoken");
const db = require("./db");
//register
const register = (uname, uid, password) => {
  return db.User.findOne({ uid }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: false,
        message: "Account already exist Please log In",
      };
    } else {
      const newUser = new db.User({
        uname,
        uid,
        password,
        event: [],
      });
      newUser.save();
      return {
        statusCode: 200,
        status: true,
        message: "Successfully Register",
      };
    }
  });
};

const login = (uid, password) => {
  return db.User.findOne({ uid, password }).then((user) => {
    if (user) {
      currentUser = user.uname;
      currentUid = uid;

      token = jwt.sign(
        {
          currentUid: uid,
        },
        "thisissecret"
      );
      return {
        token: token,
        currentUid,
        currentUser,
        statusCode: 200,
        status: true,
        message: "Successfully Login",
      };
    } else {
      return {
        statusCode: 422,
        status: false,
        message: "Invalid Credentials",
      };
    }
  });
};

//add events

const addEvent = (uid, data) => {
  return db.User.findOne({ uid }).then((user) => {
    if (user) {
      user.events.push({
        item: data,
        status: "on going",
      });
      console.log(user.events);
      user.save();
      return {
        statusCode: 200,
        status: true,
        message: "Event added Successfully",
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "Event Not added",
      };
    }
  });
};

// events
const events = (uid) => {
  return db.User.findOne({ uid }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        events: user.events,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "User does not exist",
      };
    }
  });
};

module.exports = {
  register,
  login,
  addEvent,
  events,
};
