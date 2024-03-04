const users = require("../../model/users.model");
const categories = require("../../model/categories.model");
const { model: Schedules } = require("../../model/schedules.model");
const { model: Slots } = require("../../model/slots.model");
const { model: Courses } = require("../../model/courses.model");
const { model: Users } = require("../../model/users.model");
const Course = require("../../model/courses.model").model;
const Category = categories.model;
const User = users.model;

const showCourses = async (req, res, next) => {
  try {
    const coursesDB = await Course.find({ idTrainer: req.id });
    let count = 0;
    for (let course of coursesDB) {
      let category = await Category.findOne({ _id: course.idCategory });
      course.category = category.name;
      count++;
    }
    const courses = coursesDB.map((courseDB) => {
      return {
        id: courseDB.id,
        name: courseDB.name,
        description: courseDB.description,
        category: courseDB.category,
        quantity: courseDB.idTrainee.length,
      };
    });
    const categories = await Category.find({});
    res.render("trainer/showCourses", {
      count,
      courses,
      categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const showCoursesInCategory = async (req, res, next) => {
  try {
    const idCategory = req.params.idCategory;
    let count = 0;
    const coursesDB = await Course.find({
      $and: [{ idTrainer: req.id }, { idCategory }],
    });
    for (let course of coursesDB) {
      let category = await Category.findOne({ _id: course.idCategory });
      course.category = category.name;
      count++;
    }
    const courses = coursesDB.map((courseDB) => {
      return {
        id: courseDB.id,
        name: courseDB.name,
        description: courseDB.description,
        category: courseDB.category,
        quantity: courseDB.idTrainee.length,
      };
    });
    const categories = await Category.find({});
    res.render("trainer/showCourses", {
      courses,
      count,
      idCategory,
      categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const searchCourses = async (req, res, next) => {
  try {
    let course;
    let courses;
    let count = 0;
    const search = req.query.name.trim();
    const courseDB = await Course.findOne({
      $and: [{ idTrainer: req.id }, { name: search }],
    });
    const categories = await Category.find({});
    if (courseDB) {
      const categoryDB = await Category.findOne({ _id: courseDB.idCategory });
      courseDB.category = categoryDB.name;
      course = {
        id: courseDB.id,
        name: courseDB.name,
        category: courseDB.category,
        description: courseDB.description,
        quantity: courseDB.idTrainee.length,
      };
      count = 1;
    } else {
      const searchName = new RegExp(search, "i");
      const coursesDB = await Course.find({
        $and: [{ idTrainer: req.id }, { name: searchName }],
      });
      for (let course of coursesDB) {
        let categoriesDB = await Category.findOne({ _id: course.idCategory });
        course.category = categoriesDB.name;
        count++;
      }
      courses = coursesDB.map((courseDB) => {
        return {
          id: courseDB.id,
          name: courseDB.name,
          category: courseDB.category,
          description: courseDB.description,
          quantity: courseDB.idTrainee.length,
        };
      });
    }
    res.render("trainer/showCourses", {
      count,
      course,
      courses,
      categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const searchCoursesInCategory = async (req, res, next) => {
  try {
    let courses;
    let course;
    let count = 0;
    const search = req.query.name.trim();
    const idCategory = req.params.idCategory;
    const courseDB = await Course.findOne({
      $and: [
        { idTrainer: req.id },
        { name: search },
        { idCategory: idCategory },
      ],
    });
    const categories = await Category.find({});
    if (courseDB) {
      const categoryDB = await Category.findOne({ _id: courseDB.idCategory });
      courseDB.category = categoryDB.name;
      course = {
        id: courseDB.id,
        name: courseDB.name,
        category: courseDB.category,
        description: courseDB.description,
        quantity: courseDB.idTrainee.length,
      };
      count = 1;
    } else {
      const searchName = new RegExp(search, "i");
      const coursesDB = await Course.find({
        $and: [
          { idTrainer: req.id },
          { name: searchName },
          { idCategory: idCategory },
        ],
      });
      for (let course of coursesDB) {
        let categoriesDB = await Category.findOne({ _id: course.idCategory });
        course.category = categoriesDB.name;
        count++;
      }
      courses = coursesDB.map((courseDB) => {
        return {
          id: courseDB.id,
          name: courseDB.name,
          category: courseDB.category,
          description: courseDB.description,
          quantity: courseDB.idTrainee.length,
        };
      });
    }
    res.render("trainer/showCourses", {
      count,
      course,
      courses,
      categories,
      idCategory,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

// Show Trainee
const showTrainees = async (req, res, next) => {
  try {
    const id = req.params.id;
    const courseDB = await Course.findOne({ _id: req.params.id });
    const traineesDB = await User.find({
      $and: [{ _id: { $in: courseDB.idTrainee } }, { role: "trainee" }],
    });
    const trainees = traineesDB.map((traineeDB) => {
      return {
        name: traineeDB.name,
        email: traineeDB.email,
        age: traineeDB.age,
        phone: traineeDB.phone,
        avatar: traineeDB.avatar,
      };
    });
    // Gửi id khóa học để phục vụ việc search
    const course = {
      id: courseDB._id,
      name: courseDB.name,
    };
    res.render("trainer/showTrainees", {
      course,
      trainees,
      count: trainees.length,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const searchTrainees = async (req, res, next) => {
  try {
    let trainees;
    const idCourse = req.params.id;
    search = req.query.search.trim();
    const courseDB = await Course.findOne({ _id: idCourse });
    const idTrainees = courseDB.idTrainee;

    const searchName = new RegExp(search, "i");
    const traineeByNameExtendDB = await User.find({
      $and: [
        { _id: { $in: idTrainees } },
        { role: "trainee" },
        { name: searchName },
      ],
    });
    if (traineeByNameExtendDB.length > 0) {
      trainees = traineeByNameExtendDB.map((traineeDB) => {
        return {
          name: traineeDB.name,
          email: traineeDB.email,
          age: traineeDB.age,
          avatar: traineeDB.avatar,
          phone: traineeDB.phone,
        };
      });
    }

    const course = {
      id: courseDB._id,
      name: courseDB.name,
    };

    res.render("trainer/showTrainees", {
      course,
      trainees,
      count: trainees?.length || 0,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const showSchedules = async (req, res, next) => {
  try {
    let schedules = await Schedules.find({ idCourse: req.params.id }).exec();
    const course = await Courses.findOne({ _id: req.params.id }).exec();
    let count = 0;

    for (let schedule of schedules) {
      const slot = await Slots.findOne({ _id: schedule?.idSlot }).exec();

      schedule.slot = `${slot?.name} (${slot?.startTime} - ${slot?.endTime})`;
      schedule.time = schedule.date.toDateString();
      count++;
    }

    res.render("trainer/viewSchedules", {
      count,
      course,
      schedules: schedules,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const viewAttendance = async (req, res, next) => {
  try {
    let schedule = await Schedules.findOne({ _id: req.params.id }).exec();
    const slot = await Slots.findOne({ _id: schedule?.idSlot }).exec();
    const course = await Courses.findOne({ _id: schedule?.idCourse }).exec();
    const trainer = await Users.findOne({ _id: course?.idTrainer }).exec();
    const trainees = await Users.find({
      $and: [{ role: "trainee" }, { _id: course.idTrainee }],
    });

    let idTraineeNotPresent = [];
    for (let trainee of trainees) {
      trainee.attendance = null;

      if (schedule.idPresent.includes(trainee._id)) {
        trainee.attendance = true;
        continue;
      }

      if (schedule.idAbsent.includes(trainee._id)) {
        trainee.attendance = false;
      }

      idTraineeNotPresent.push(trainee._id);
    }

    if (
      schedule.date < new Date() &&
      schedule.idPresent.length + schedule.idAbsent.length < trainees.length
    ) {
      await Schedules.updateOne(
        { _id: req.params.id },
        {
          idAbsent: idTraineeNotPresent,
        }
      );

      for (let trainee of trainees) {
        if (idTraineeNotPresent.includes(trainee._id)) {
          trainee.attendance = false;
        }
      }
    }

    schedule.slot = `${slot?.name} (${slot?.startTime} - ${slot?.endTime})`;
    schedule.nameCourse = course.name;
    schedule.nameTrainer = trainer.name;
    schedule.time = schedule.date.toDateString();
    schedule.trainees = trainees;
    schedule.time = schedule.date.toDateString();

    schedule.dateFormatted = `${schedule.date.getFullYear()}-${
      schedule.date.getDate() > 10
        ? schedule.date.getDate()
        : "0" + schedule.date.getDate()
    }-${
      schedule.date.getMonth() > 10
        ? schedule.date.getMonth()
        : "0" + schedule.date.getMonth()
    }`;

    res.render("trainer/viewAttendance", {
      schedule: schedule,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    res.redirect("/trainer");
  }
};

const updateAttendance = async (req, res, next) => {
  try {
    const presents = req.body.presents
      ?.split(",")
      .map((present) => Number(present));
    const absents = req.body.absents
      ?.split(",")
      .map((absent) => Number(absent));

    await Schedules.updateOne(
      { _id: req.params.id },
      {
        idPresent: presents,
        idAbsent: absents,
      }
    );

    const schedule = await Schedules.findOne({ _id: req.params.id }).exec();

    return res.redirect(`/trainer/viewSchedules/${schedule.idCourse}`);
  } catch (err) {
    next(err);
  }
};

const searchSchedules = async (req, res, next) => {
  try {
    let schedules = await Schedules.find({ idCourse: req.params.id }).exec();
    const course = await Courses.findOne({ _id: req.params.id }).exec();
    let count = 0;

    const searchSchedule = new RegExp(req.query.search, "i");

    let results = [];

    for (let schedule of schedules) {
      const slot = await Slots.findOne({ _id: schedule?.idSlot }).exec();

      schedule.slot = `${slot?.name} (${slot?.startTime} - ${slot?.endTime})`;
      schedule.time = schedule.date.toDateString();

      if (
        schedule.time.match(searchSchedule) ||
        schedule.slot.match(searchSchedule)
      ) {
        results.push(schedule);
        count++;
      }
    }

    res.render("trainer/viewSchedules", {
      count,
      course,
      schedules: req.query.search ? results : schedules,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const trainer = {
  showCourses,
  showCoursesInCategory,
  showTrainees,
  searchCourses,
  searchCoursesInCategory,
  searchTrainees,
  showSchedules,
  viewAttendance,
  updateAttendance,
  searchSchedules,
};

module.exports = trainer;
