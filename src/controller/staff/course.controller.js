const Courses = require("../../model/courses.model").model;
const Categories = require("../../model/categories.model").model;
const Users = require("../../model/users.model").model;
const Schedules = require("../../model/schedules.model").model;

//[GET] /staff/viewCourse
// giao diện lớp học
const show = async (req, res, next) => {
  try {
    const countDocumentsDeleted = await Courses.countDocumentsDeleted();
    const courses = await Courses.find({});
    let dateNow;
    let count = 0;
    for (let course of courses) {
      let category = await Categories.findOne({ _id: course.idCategory });
      course.nameCategory = category?.name;
      let date = new Date(course.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      course.dateCreated = dateNow;
      count++;
    }

    res.render("staff/courses/viewCourses", {
      count,
      courses: courses,
      countDocumentsDeleted,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewCourse/create
// giao diện tạo lớp học
const create = async (req, res, next) => {
  try {
    const categories = await Categories.find({});
    if (categories.length > 0) {
      return res.render("staff/courses/create", {
        categories: categories,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
      });
    }
  } catch (err) {
    next(err);
  }
};

//[POST] /staff/viewCourse/store
// Lưu lớp học
const store = async (req, res, next) => {
  try {
    await new Courses(req.body).save();
    res.redirect("/staff/viewCourses");
  } catch (err) {
    console.log(err);
    const categories = await Categories.find({});
    return res.render("staff/courses/create", {
      categories: categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[GET] /staff/viewCourse/:id/edit
// giao diện lớp học
const edit = async (req, res, next) => {
  try {
    const categories = await Categories.find({});
    const course = await Courses.findOne({ _id: req.params.id });
    res.render("staff/courses/edit", {
      categories: categories,
      course: course,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[PUT] /staff/viewCourse/:id
// cập nhật lớp học
const update = async (req, res, next) => {
  try {
    await Courses.updateOne({ _id: req.params.id }, req.body);
    res.redirect("/staff/viewCourses");
  } catch (err) {
    const categories = await Categories.find({});
    const course = await Courses.findOne({ _id: req.params.id });
    return res.render("staff/courses/edit", {
      categories: categories,
      course: course,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[GET] /staff/viewCourse/search
// tìm kiếm lớp học theo tên
const search = async (req, res, next) => {
  try {
    const countDocumentsDeleted = await Courses.countDocumentsDeleted();
    const search = req.query.search.trim();
    const course = await Courses.findOne({ name: search });
    let courses;
    let count = 0;
    let dateNow;
    if (course) {
      const category = await Categories.findOne({ _id: course.idCategory });
      course.nameCategory = category.name;
      let date = new Date(course.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      course.dateCreated = dateNow;
    } else {
      const searchCourses = new RegExp(search, "i");
      courses = await Courses.find({ name: searchCourses });
      for (let course of courses) {
        let category = await Categories.findOne({ _id: course.idCategory });
        course.nameCategory = category.name;
        let date = new Date(course.createdAt * 1000);
        if (date.getSeconds() < 10) {
          dateNow = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
        } else {
          dateNow = `${date.getDate()}/${
            date.getMonth() + 1
          }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
        }
        course.dateCreated = dateNow;
        count++;
      }
    }
    res.render("staff/courses/viewCourses", {
      count: course ? 1 : count,
      course: course,
      courses: courses,
      countDocumentsDeleted,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[DELETE] /staff/viewCourse/:id
//Xóa lớp học
const destroy = async (req, res, next) => {
  try {
    await Courses.delete({ _id: req.params.id });
    res.redirect("back");
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewCourse/trash/store
// Giao diện lớp học đã xóa
const storeTrash = async (req, res, next) => {
  try {
    const courses = await Courses.findDeleted({});
    const categories = await Categories.find({});
    let dateNow;
    for (let course of courses) {
      let date = new Date(course.deletedAt);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      course.dateDeleted = dateNow;
    }
    res.render("staff/courses/trash", {
      courses: courses,
      categories: categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[PUT] /staff/viewCourse/:id/restore
// khôi phục lớp học
const restore = async (req, res, next) => {
  try {
    await Courses.restore({ _id: req.params.id });
    res.redirect("back");
  } catch (err) {
    next(err);
  }
};

//[DELETE] /staff/viewCourse/:id/force
// Xóa vĩnh viễn
const deleteForce = async (req, res, next) => {
  try {
    await Courses.deleteOne({ _id: req.params.id });
    res.redirect("back");
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewCourse/:id
// Hiển thị chi tiết lớp học
const showDetail = async (req, res, next) => {
  try {
    const course = await Courses.findOne({ _id: req.params.id });
    const trainer = await Users.findOne({
      $and: [{ role: "trainer" }, { _id: course.idTrainer }],
    });
    const trainees = await Users.find({
      $and: [{ role: "trainee" }, { _id: course.idTrainee }],
    });
    const category = await Categories.findOne({ _id: course.idCategory });
    course.nameCategory = category.name;
    if (trainer) {
      course.nameTrainer = trainer.name;
    } else {
      course.nameTrainer = null;
    }
    course.objTrainee = trainees;
    const schedule = await Schedules.findOne({ idCourse: req.params.id });

    res.render("staff/courses/detailCourse", {
      course,
      deleteTrainer: !(schedule && course.nameTrainer),
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[POST] /staff/viewCourse/:id/addTrainee
// thêm hoc viên
const addTrainee = async (req, res, next) => {
  try {
    await Courses.updateOne(
      { _id: req.params.id },
      { $push: { idTrainee: req.body.traineeIds } }
    );
    res.redirect(`/staff/viewCourses/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewCourse/:id/viewAddTrainee
// giao diện lớp học
const viewAddTrainee = async (req, res, next) => {
  try {
    const trainees = await Users.find({ role: "trainee" });
    const course = await Courses.findOne({ _id: req.params.id });
    const traineesOutCourse = [];
    const page = parseInt(req.query.page) || 1;
    const perPage = 3;
    let countPage;
    let arrayCountPage = [];
    let start = (page - 1) * perPage;
    let end = page * perPage;
    for (let trainee of trainees) {
      let courseIdTrainee = course.idTrainee.some((idTrainee) => {
        return idTrainee == trainee._id;
      });
      if (
        !courseIdTrainee &&
        course.idTraineeRegistered?.includes(trainee._id)
      ) {
        traineesOutCourse.push(trainee);
      }
    }
    countPage = Math.ceil(traineesOutCourse.length / perPage);
    for (let i = 1; i <= countPage; i++) {
      arrayCountPage.push(i);
    }
    let pageIndex = page - 1;
    res.render("staff/courses/addTrainee", {
      course,
      countPage,
      pageIndex,
      arrayCountPage,
      trainees: traineesOutCourse.slice(start, end),
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[DELETE] /staff/viewCourse/:id/deleteTrainee
// Xóa hv
const deleteTrainee = async (req, res, next) => {
  try {
    await Courses.updateOne(
      { _id: req.params.id },
      { $pull: { idTrainee: req.params.idTrainee } }
    );
    await Courses.updateOne(
      { _id: req.params.id },
      { $pull: { idTraineeRegistered: req.params.idTrainee } }
    );
    res.redirect("back");
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewCourse/:id/viewAddTrainer
// giao diện thêm gv
const viewAddTrainer = async (req, res, next) => {
  try {
    const trainers = await Users.find({ role: "trainer" });
    const course = await Courses.findOne({ _id: req.params.id });
    const category = await Categories.findOne({ _id: course.idCategory });
    const trainersSelected = trainers.filter((trainer) =>
      category.idTrainer.includes(trainer._id)
    );
    res.render("staff/courses/addTrainer", {
      trainers: trainersSelected,
      course,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[POST] /staff/viewCourse/:id/addTrainer
// thêm gv
const addTrainer = async (req, res, next) => {
  try {
    await Courses.updateOne(
      { _id: req.params.id },
      { idTrainer: req.body.trainerId }
    );
    res.redirect(`/staff/viewCourses/${req.params.id}`);
  } catch (err) {
    next(err);
  }
};

//[DELETE] /staff/viewCourse/:id/deleteTrainer
// xóa gv
const deleteTrainer = async (req, res, next) => {
  try {
    await Courses.updateOne({ _id: req.params.id }, { idTrainer: "" });
    res.redirect("back");
  } catch (err) {
    next(err);
  }
};

// tìm kiếm theo tên gv
const searchAddTrainer = async (req, res, next) => {
  try {
    const nameSearch = req.query.name.trim();
    let trainers = await Users.find({
      $and: [{ role: "trainer" }, { name: nameSearch }],
    });
    const course = await Courses.findOne({ _id: req.params.id });
    const category = await Categories.findOne({ _id: course.idCategory });
    if (trainers.length == 0) {
      const search = new RegExp(nameSearch, "i");
      trainers = await Users.find({
        $and: [{ role: "trainer" }, { name: search }],
      });
    }
    const trainersSelected = trainers.filter((trainer) =>
      category.idTrainer.includes(trainer._id)
    );
    res.render("staff/courses/addTrainer", {
      trainers: trainersSelected,
      course,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

// tìm kiếm theo tên hv
const searchAddTrainee = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const perPage = 3;
    let countPage;
    let arrayCountPage = [];
    let start = (page - 1) * perPage;
    let end = page * perPage;
    let nameSearch = req.query.name.trim();
    let trainees = await Users.find({
      $and: [{ role: "trainee" }, { name: nameSearch }],
    });
    const course = await Courses.findOne({ _id: req.params.id });
    if (trainees.length == 0) {
      const search = new RegExp(nameSearch, "i");
      trainees = await Users.find({
        $and: [{ role: "trainee" }, { name: search }],
      });
    }
    const traineesOutCourse = [];
    for (let trainee of trainees) {
      let courseIdTrainee = course.idTrainee.some((idTrainee) => {
        return idTrainee == trainee._id;
      });
      if (!courseIdTrainee) {
        traineesOutCourse.push(trainee);
      }
    }
    countPage = Math.ceil(traineesOutCourse.length / perPage);
    for (let i = 1; i <= countPage; i++) {
      arrayCountPage.push(i);
    }
    let pageIndex = page - 1;
    res.render("staff/courses/addTrainee", {
      course,
      countPage,
      pageIndex,
      arrayCountPage,
      nameSearch,
      trainees: traineesOutCourse.slice(start, end),
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const course = {
  show,
  create,
  store,
  edit,
  update,
  search,
  destroy,
  storeTrash,
  restore,
  deleteForce,
  showDetail,
  addTrainee,
  viewAddTrainee,
  addTrainer,
  viewAddTrainer,
  deleteTrainee,
  deleteTrainer,
  searchAddTrainer,
  searchAddTrainee,
};
module.exports = course;
