const mongoose = require("mongoose");
const mongoURI =
  "mongodb://localhost:27017/DailyNotes?readPreference=primary&appname=MongoDB%20Compass&ssl=false";
const connectToMongo = () => {
  mongoose.connect(mongoURI, () => {
    console.log("connected to mongo Successfully");
  });
};
module.exports = connectToMongo;
