const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const uri =
  "mongodb+srv://kush:5XCZW5ADqHZDu6Ay@cluster0.1qgxj1a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// const conn = MongoClient.connect(uri, function (err, client) {
//   if (err) throw err;
//   let db = client.db("test");
//   db.collection("user")
//     .find()
//     .toArray(function (err, result) {
//       if (err) throw err;
//       console.log(result);
//       client.close();
//     });
// });

const mongoConnect = (callback) => {
  MongoClient.connect(uri)
    .then((client) => {
      console.log("connected");
      _db = client.db();
      callback();
    })
    .catch((err) => {
      console.log(err);
      throw err;
    });
};

// const mongoConnect = () => {
//   MongoClient.connect(uri, { useNewUrlParser: true }, (error, client) => {
//     if (error) {
//       return console.log("Connection failed for some reason");
//     }
//     console.log("Connection established - All well");
//     const db = client.db("test");
//   });
// };
const getDb = () => {
  if (_db) {
    return _db;
  }
  throw "No database found!";
};
module.exports = {getDb,mongoConnect};
// module.exports = mongoConnect;
