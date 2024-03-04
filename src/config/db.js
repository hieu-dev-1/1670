const mongoose = require("mongoose");
const role = require("../model/roles.model");
const category = require("../model/categories.model");
const user = require("../model/users.model");
const slot = require("../model/slots.model");
const course = require("../model/courses.model");
const schedule = require("../model/schedules.model");

const connect = async () => {
  try {
    // await mongoose.connect('mongodb://localhost:27017/cms_project_dev');
    // mongodb+srv://group5:group5@cluster0.4caia.mongodb.net/group5?retryWrites=true&w=majority
    // await mongoose.connect(`mongodb:${process.env.DB_HOST}/${process.env.DB_NAME}`);
    // await mongoose.connect('mongodb://localhost:27017/group5_project_application_development');
    await mongoose.connect("mongodb://localhost:27017/1670");
    // await mongoose.connect(`mongodb+srv://admin:admin@cluster0.ewlyy.mongodb.net/Project?retryWrites=true&w=majority`);
    //await mongoose.connect('mongodb://localhost:27017/group5_project_application_development');
    //await mongoose.connect('mongodb://localhost:27017/Web');
    console.log("Connected successful !");
    await role.initialize;
    await category.initialize;
    await user.initialize;
    await slot.initialize;
    await course.initialize;
    await schedule.initialize;
  } catch (err) {
    console.log("Connect failed: " + err);
  }
};

module.exports = { connect };
