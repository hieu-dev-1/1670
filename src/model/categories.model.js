const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const category = new Schema(
  {
    name: {
      type: String,
      unique: true,
      min: 1,
    },
    idTrainer: [{ type: Number, ref: "user", default: [] }],
  },
  {
    timestamps: { currentTime: () => Math.floor(Date.now() / 1000) },
  }
);

const categoryModel = mongoose.model("Category", category);
function initialize() {
  categoryModel.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new categoryModel({
        name: "IT",
      }).save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Add IT category !");
        }
      });
      new categoryModel({
        name: "Business",
      }).save((err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Add Business category !");
        }
      });
    }
  });
}
const Categories = {
  model: categoryModel,
  initialize: initialize(),
};

module.exports = Categories;
