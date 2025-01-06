const mongoose = require("mongoose");

function connectToDb() {
  mongoose
    .connect(process.env.MONGODB_CONNECT)
    .then(() => {
      console.log("connectted to db");
    })
    .catch((err) => console.log(err));
}

module.exports = connectToDb;
