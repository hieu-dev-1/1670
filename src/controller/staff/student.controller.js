const { model: Course, Courses } = require("../../model/courses.model");
const Students = require("../../model/users.model").model;

//[GET] /staff/viewStudent/create
const create = (req, res, next) => {
  res.render("staff/students/createStudent", {
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email,
  });
};

//[POST] /staff/viewStudent/store
const store = async (req, res, next) => {
  try {
    await new Students({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      phone: req.body.phone,
      address: req.body.address,
      role: "trainee",
    }).save();
    return res.redirect("/staff/viewStudent");
  } catch (err) {
    return res.render("staff/students/createStudent", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[GET] /staff/viewStudent
const show = async (req, res, next) => {
  try {
    let students = await Students.find({ role: "trainee" });
    let dateNow;
    let count = 0;
    const page = parseInt(req.query.page) || 1;
    const perPage = 7;
    let countPage;
    let arrayCountPage = [];
    let start = (page - 1) * perPage;
    let end = page * perPage;
    for (let student of students) {
      let date = new Date(student.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      student.dateCreated = dateNow;
      count++;
    }
    countPage = Math.ceil(students.length / perPage);

    for (let i = 1; i <= countPage; i++) {
      arrayCountPage.push(i);
    }
    let pageIndex = page - 1;
    res.render("staff/students/viewStudent", {
      count,
      countPage,
      pageIndex,
      arrayCountPage,
      students: students.slice(start, end),
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewStudent/:id/edit
const edit = async (req, res, next) => {
  try {
    let student = await Students.findOne({ _id: req.params.id });
    res.render("staff/students/editStudent", {
      student: student,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    return res.render("staff/students/editStudent", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[PUT] /staff/viewStudent/:id
const update = async (req, res, next) => {
  try {
    await Students.updateOne({ _id: req.params.id }, req.body);
    return res.redirect("/staff/viewStudent");
  } catch (err) {
    let student = await Students.findOne({ _id: req.params.id });
    res.render("staff/students/editStudent", {
      student: student,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[DELETE] /staff/viewStudent/:id
const deleteS = async (req, res, next) => {
  try {
    const coursesDB = await Course.find({ idTrainee: req.params.id });

    for (let course of coursesDB) {
      await Course.updateOne(
        { _id: course._id },
        { $pull: { idTrainee: req.params.id } }
      ).exec();
    }

    await Students.deleteOne({ _id: req.params.id });
    res.redirect("/staff/viewStudent");
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewStudent/search
const search = async (req, res, next) => {
  try {
    let student = await Students.findOne({
      $and: [{ name: req.query.search }, { role: "trainee" }],
    });
    let students;
    let count = 0;
    let dateNow;
    const perPage = 7;
    const page = parseInt(req.query.page) || 1;
    let countPage;
    let arrayCountPage = [];
    let start = (page - 1) * perPage;
    let end = page * perPage;
    let pageIndex = page - 1;

    if (student) {
      let date = new Date(student.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      student.dateCreated = dateNow;
    }
    if (student) {
      return res.render("staff/students/viewStudent", {
        count: 1,
        nameSearch: req.query.search,
        countPage: 1,
        pageIndex,
        arrayCountPage: [1],
        student: student,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
      });
    }
    const searchStudent = new RegExp(req.query.search, "i");
    students = await Students.find({
      $and: [{ name: searchStudent }, { role: "trainee" }],
    });
    for (let student of students) {
      let date = new Date(student.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      student.dateCreated = dateNow;
      count++;
    }
    countPage = Math.ceil(students.length / perPage);

    for (let i = 1; i <= countPage; i++) {
      arrayCountPage.push(i);
    }

    res.render("staff/students/viewStudent", {
      count,
      nameSearch: req.query.search,
      countPage,
      pageIndex,
      arrayCountPage,
      students: students.slice(start, end),
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const student = {
  create,
  store,
  show,
  edit,
  update,
  deleteS,
  search,
};

module.exports = student;
