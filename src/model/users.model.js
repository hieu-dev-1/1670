const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AutoIncrement = require("mongoose-sequence")(mongoose);
const mongooseDelete = require("mongoose-delete");
const roles = require("./roles.model");
const rolesModel = roles.model;
const bcrypt = require("bcryptjs");

const salt = bcrypt.genSaltSync(10);
let passwordHash = bcrypt.hashSync("123456", salt);

const user = new Schema(
  {
    _id: Number,
    name: { type: String, min: 1, max: 50 },
    email: { type: String, min: 1, max: 100, unique: true },
    password: { type: String, min: 1, default: passwordHash },
    age: { type: Number, min: 1, default: 30 },
    phone: { type: String, min: 9 },
    address: { type: String, min: 1, max: 255 },
    avatar: { type: String, default: "avatar.jpg" },
    role: { type: String, min: 1, ref: "roles" },
  },
  {
    _id: false,
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

user.plugin(AutoIncrement);
user.plugin(mongooseDelete, { overrideMethod: "all", deleteAt: true });

const userModel = mongoose.model("User", user);

function initialize() {
  userModel.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new userModel({
        name: "Admin",
        email: "admin@devpro.vn",
        age: 21,
        phone: "0327977049",
        address: "Hà Nội",
        role: "admin",
      }).save((err) => {
        if (err) console.log(err);
        else console.log("Add admin user !");
      });

      for (let index = 0; index < 1; index++) {
        new userModel({
          name: `Staff ${index + 1}`,
          email: `staff${index + 1}@devpro.vn`,
          age: 20,
          phone: "0327977049",
          address: "Hà Nội",
          role: "staff",
        }).save((err) => {
          if (err) console.log(err);
          else console.log("Add staff user !");
        });
      }

      for (let index = 0; index < 5; index++) {
        new userModel({
          name: `Trainer ${index + 1}`,
          email: `trainer${index + 1}@devpro.vn`,
          age: 21,
          phone: "0327977049",
          address: "Hà Nội 2",
          role: "trainer",
        }).save((err) => {
          if (err) console.log(err);
          else console.log("Add trainer user !");
        });
      }

      for (let index = 0; index < 20; index++) {
        new userModel({
          name: `Trainee ${index + 1}`,
          email: `trainee${index + 1}@devpro.vn`,
          age: 21,
          phone: "0327977049",
          address: "Hà Nội 2",
          role: "trainee",
        }).save((err) => {
          if (err) console.log(err);
          else console.log("Add trainee user !");
        });
      }
    }
  });
}

const Users = {
  model: userModel,
  initialize: initialize(),
};
module.exports = Users;
