const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");
const category = require("./categories.model");
const userModel = require("./users.model").model;
const Schema = mongoose.Schema;
const categoryModel = category.model;

const course = new Schema(
  {
    name: { type: String, min: 1, max: 50, unique: true },
    description: { type: String },
    idCategory: { type: Schema.Types.ObjectId, ref: "category" },
    idTrainer: { type: Number, ref: "user", default: "" },
    idTrainee: [{ type: Number, ref: "user", default: [] }],
    idTraineeRegistered: [{ type: Number, ref: "user", default: [] }],
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

course.plugin(mongooseDelete, { overrideMethods: "all", deletedAt: true });

const courseModel = mongoose.model("courses", course);

function initialize() {
  courseModel.estimatedDocumentCount(async (err, count) => {
    if (err || count > 0) {
      return;
    }

    const trainees = (await userModel.find({ role: "trainee" }).exec()).map(
      (trainee) => trainee["_id"]
    );
    const trainers = (await userModel.find({ role: "trainer" }).exec()).map(
      (trainer) => trainer["_id"]
    );
    const categories = await categoryModel.find({});

    await new courseModel({
      name: `Course Application`,
      description: `Course Application`,
      idCategory: categories[0]._id,
      idTrainer: trainers[0],
      idTrainee: trainees.slice(0, 3),
    }).save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Add course successful!");
      }
    });

    await new courseModel({
      name: `Course Mobile`,
      description: `Course Mobile`,
      idCategory: categories[0]._id,
      idTrainer: trainers[1],
      idTrainee: trainees.slice(3, 6),
    }).save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Add course successful!");
      }
    });

    await new courseModel({
      name: `Course Website`,
      description: `Course Website`,
      idCategory: categories[0]._id,
      idTrainer: trainers[2],
      idTrainee: trainees.slice(6, 9),
    }).save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Add course successful!");
      }
    });

    await new courseModel({
      name: `Course Marketing`,
      description: `Course Marketing`,
      idCategory: categories[1]._id,
      idTrainer: trainers[3],
      idTrainee: trainees.slice(9, 11),
    }).save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Add course successful!");
      }
    });

    await new courseModel({
      name: `Course Business`,
      description: `Course Business`,
      idCategory: categories[1]._id,
      idTrainer: trainers[4],
      idTrainee: trainees.slice(11, 15),
    }).save((err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("Add course successful!");
      }
    });
  });
}

const Courses = {
  model: courseModel,
  initialize: initialize(),
};

module.exports = Courses;
