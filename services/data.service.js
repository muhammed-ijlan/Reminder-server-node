const res = require("express/lib/response");
const jwt = require("jsonwebtoken");
const db = require("./db");
require("mongoose");

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
      db.Event.create({
        eventName: data,
        id: Date.now(),
      }).then((newEvent) => {
        user.events.push(newEvent);
        user.save();
      });
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

const deleteUser = (uid) => {
  return db.User.deleteOne({ uid }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        message: `User ID ${uid} is Deleted`,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: "User deltetion Failed",
      };
    }
  });
};

const deleteEvent = async (uid, id) => {
  const user = await db.User.findOne({ uid });
  if (user) {
    const dbEvent = await db.Event.findOne({ id });

    if (dbEvent != null) {
      const filteredEvent = user.events.filter((event) => {
        return event.id !== dbEvent.id;
      });

      if (filteredEvent) {
        user.events = filteredEvent;

        db.Event.deleteOne({ id }).then((result) => {
          if (result) {
            console.log(result);
          }
        });
        user.save();

        return {
          statusCode: 200,
          status: true,
          events: filteredEvent,
          message: `Event Deleted`,
        };
      } else {
        return {
          statusCode: 401,
          status: false,
          message: `Event Not matching`,
        };
      }
    } else {
      return {
        statusCode: 401,
        status: false,
        message: `Event Not found`,
      };
    }
  } else {
    return {
      statusCode: 401,
      status: false,
      message: "no user",
    };
  }
};

// const editEvent = async (uid, id, data) => {
//   const user = await db.User.findOne({ uid });
//   if (user) {
//     const dbEvent = await db.Event.findOneAndUpdate(
//       { id },
//       { $set: { eventName: data } },
//       { upsert: true }
//     );
//     dbEvent.save();
//     if (dbEvent !== null) {
//       let filteredEvent = user.events.map((event) => {
//         return event.eventName !== dbEvent.eventName;
//       });
//       if (filteredEvent) {
//         console.log(filteredEvent);
//         // user.events = filteredEvent;
//         console.log("Event updated");
//         return {
//           statusCode: 201,
//           status: true,
//           // events: eventObj,
//           message: `Event Updated`,
//         };
//       } else {
//         return {
//           statusCode: 401,
//           status: false,
//           message: `Event is Null`,
//         };
//       }
//     } else {
//       return {
//         statusCode: 401,
//         status: false,
//         message: `Event is Null`,
//       };
//     }
//   } else {
//     return {
//       statusCode: 401,
//       status: false,
//       message: "no user found",
//     };
//   }
// };

module.exports = {
  register,
  login,
  addEvent,
  events,
  deleteUser,
  deleteEvent,
};
