const users = require("../../model/users.model");
const categories = require("../../model/categories.model");
const { model: Schedules } = require("../../model/schedules.model");
const { model: Courses } = require("../../model/courses.model");
const { model: Slots } = require("../../model/slots.model");
const { model: Users } = require("../../model/users.model");
const Course = require("../../model/courses.model").model;
const Category = categories.model;
const User = users.model;

// Khoa hoc cua toi
const showCourses = async (req, res, next) => {
  try {
    const coursesDB = await Course.find({ idTrainee: req.id });
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
    res.render("trainee/showCourses", {
      courses,
      categories,
      count,
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
    if (!idCategory.match(/^[0-9a-fA-F]{24}$/))
      return res.send("No courses found");
    const coursesDB = await Course.find({
      $and: [{ idTrainee: req.id }, { idCategory }],
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
    res.render("trainee/showCourses", {
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
      $and: [{ idTrainee: req.id }, { name: search }],
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
        $and: [{ idTrainee: req.id }, { name: searchName }],
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
    res.render("trainee/showCourses", {
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
    if (!idCategory.match(/^[0-9a-fA-F]{24}$/))
      return res.send("No courses found");
    const courseDB = await Course.findOne({
      $and: [
        { idTrainee: req.id },
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
          { idTrainee: req.id },
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
    res.render("trainee/showCourses", {
      course,
      courses,
      count,
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
    if (!id.match(/^[0-9a-fA-F]{24}$/)) return res.send("No courses found");
    const courseDB = await Course.findOne({ _id: req.params.id });
    const traineesDB = await User.find({
      $and: [{ _id: { $in: courseDB.idTrainee } }, { role: "trainee" }],
    });
    const trainersDB = await User.find({
      $and: [{ _id: { $in: courseDB.idTrainer } }, { role: "trainer" }],
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
    const trainers = trainersDB.map((trainerDB) => {
      return {
        name: trainerDB.name,
        email: trainerDB.email,
        age: trainerDB.age,
        phone: trainerDB.phone,
        avatar: trainerDB.avatar,
      };
    });
    // Gửi id khóa học để phục vụ việc search
    const course = {
      id: courseDB._id,
      name: courseDB.name,
    };
    res.render("trainee/showTrainees", {
      course,
      trainees,
      trainers,
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
    if (!idCourse.match(/^[0-9a-fA-F]{24}$/))
      return res.send("No courses found");
    const courseDB = await Course.findOne({ _id: idCourse });
    const trainersDB = await User.find({
      $and: [{ _id: { $in: courseDB.idTrainer } }, { role: "trainer" }],
    });
    const trainers = trainersDB.map((trainerDB) => {
      return {
        name: trainerDB.name,
        email: trainerDB.email,
        age: trainerDB.age,
        phone: trainerDB.phone,
        avatar: trainerDB.avatar,
      };
    });
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

    res.render("trainee/showTrainees", {
      course,
      trainees,
      trainers,
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

// List Schedule
const viewSchedules = async (req, res, next) => {
  try {
    let schedules = await Schedules.find({ idCourse: req.params.id }).exec();
    const course = await Courses.findOne({ _id: req.params.id }).exec();
    const trainees = await Users.find({
      $and: [{ role: "trainee" }, { _id: course.idTrainee }],
    });
    let count = 0;

    for (let schedule of schedules) {
      const slot = await Slots.findOne({ _id: schedule?.idSlot }).exec();
      count++;
      schedule.slot = `${slot?.name} (${slot?.startTime} - ${slot?.endTime})`;
      schedule.time = schedule.date?.toDateString();
      schedule.attendance = null;

      if (schedule.idPresent.includes(req.id)) {
        schedule.attendance = true;
        continue;
      }

      if (schedule.idAbsent.includes(req.id)) {
        schedule.attendance = false;
      }

      if (schedule.date < new Date()) {
        schedule.attendance = false;
      }
    }

    res.render("trainee/viewSchedules", {
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
      schedule.attendance = null;
      schedule.checkAttendance = "Not Yet";

      if (schedule.idPresent.includes(req.id)) {
        schedule.attendance = true;
        schedule.checkAttendance = "Present";
      }

      if (schedule.idAbsent.includes(req.id)) {
        schedule.attendance = false;
        schedule.checkAttendance = "Absent";
      }

      if (
        schedule.time.match(searchSchedule) ||
        schedule.slot.match(searchSchedule) ||
        schedule.checkAttendance.match(searchSchedule)
      ) {
        count++;
        results.push(schedule);
      }
    }

    res.render("trainee/viewSchedules", {
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

// Danh sach khoa hoc
const limit = 5;
const listCourse = async (req, res, next) => {
  try {
    const coursesDB = await Course.find({});
    for (let course of coursesDB) {
      let category = await Category.findOne({ _id: course.idCategory });
      course.category = category.name;
    }

    const courses = coursesDB
      .filter((course) => !course.idTrainee?.includes(req.id))
      .map((courseDB) => {
        return {
          id: courseDB.id,
          name: courseDB.name,
          description: courseDB.description,
          category: courseDB.category,
          quantity: courseDB.idTrainee.length,
          registered: !!courseDB.idTraineeRegistered?.includes(req.id),
          full_slot: courseDB.idTraineeRegistered?.length >= limit,
        };
      });
    const categories = await Category.find({});
    return res.render("trainee/showCourses", {
      type: "list",
      courses,
      categories,
      count: courses?.length || 0,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const searchlistCourse = async (req, res, next) => {
  try {
    let course;
    let courses;
    let count = 0;
    const search = req.query.name.trim();
    const courseDB = await Course.findOne({ name: search });
    const categories = await Category.find({});
    if (courseDB && !courseDB.idTrainee?.includes(req.id)) {
      const categoryDB = await Category.findOne({ _id: courseDB.idCategory });
      courseDB.category = categoryDB.name;
      course = {
        id: courseDB.id,
        name: courseDB.name,
        category: courseDB.category,
        description: courseDB.description,
        quantity: courseDB.idTrainee.length,
        registered: !!courseDB.idTraineeRegistered?.includes(req.id),
        full_slot: courseDB.idTraineeRegistered?.length >= limit,
      };
      count = 1;
    } else {
      const searchName = new RegExp(search, "i");
      const coursesDB = await Course.find({ name: searchName });
      for (let course of coursesDB) {
        let categoriesDB = await Category.findOne({ _id: course.idCategory });
        course.category = categoriesDB.name;
        count++;
      }
      courses = coursesDB
        .filter((course) => !course.idTrainee?.includes(req.id))
        .map((courseDB) => {
          return {
            id: courseDB.id,
            name: courseDB.name,
            category: courseDB.category,
            description: courseDB.description,
            quantity: courseDB.idTrainee.length,
            registered: !!courseDB.idTraineeRegistered?.includes(req.id),
            full_slot: courseDB.idTraineeRegistered?.length >= limit,
          };
        });
    }

    res.render("trainee/showCourses", {
      type: "list",
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

const showListCourseInCategory = async (req, res, next) => {
  try {
    const idCategory = req.params.idCategory;
    let count = 0;
    if (!idCategory.match(/^[0-9a-fA-F]{24}$/))
      return res.send("No courses found");
    const coursesDB = await Course.find({ idCategory });
    for (let course of coursesDB) {
      let category = await Category.findOne({ _id: course.idCategory });
      course.category = category.name;
      count++;
    }
    const courses = coursesDB
      .filter((course) => !course.idTrainee?.includes(req.id))
      .map((courseDB) => {
        return {
          id: courseDB.id,
          name: courseDB.name,
          description: courseDB.description,
          category: courseDB.category,
          quantity: courseDB.idTrainee.length,
          registered: !!courseDB.idTraineeRegistered?.includes(req.id),
          full_slot: courseDB.idTraineeRegistered?.length >= limit,
        };
      });
    const categories = await Category.find({});
    res.render("trainee/showCourses", {
      type: "list",
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

const searchlistCourseInCategory = async (req, res, next) => {
  try {
    let courses;
    let course;
    let count = 0;
    const search = req.query.name.trim();
    const idCategory = req.params.idCategory;
    if (!idCategory.match(/^[0-9a-fA-F]{24}$/))
      return res.send("No courses found");
    const courseDB = await Course.findOne({
      $and: [{ name: search }, { idCategory: idCategory }],
    });
    const categories = await Category.find({});
    if (courseDB && !courseDB.idTrainee?.includes(req.id)) {
      const categoryDB = await Category.findOne({ _id: courseDB.idCategory });
      courseDB.category = categoryDB.name;
      course = {
        id: courseDB.id,
        name: courseDB.name,
        category: courseDB.category,
        description: courseDB.description,
        quantity: courseDB.idTrainee.length,
        registered: !!courseDB.idTraineeRegistered?.includes(req.id),
        full_slot: courseDB.idTraineeRegistered?.length >= limit,
      };
      count = 1;
    } else {
      const searchName = new RegExp(search, "i");
      const coursesDB = await Course.find({
        $and: [{ name: searchName }, { idCategory: idCategory }],
      });
      for (let course of coursesDB) {
        let categoriesDB = await Category.findOne({ _id: course.idCategory });
        course.category = categoriesDB.name;
        count++;
      }
      courses = coursesDB
        .filter((course) => !course.idTrainee?.includes(req.id))
        .map((courseDB) => {
          return {
            id: courseDB.id,
            name: courseDB.name,
            category: courseDB.category,
            description: courseDB.description,
            quantity: courseDB.idTrainee.length,
            registered: !!courseDB.idTraineeRegistered?.includes(req.id),
            full_slot: courseDB.idTraineeRegistered?.length >= limit,
          };
        });
    }
    res.render("trainee/showCourses", {
      type: "list",
      course,
      courses,
      count,
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

const registerCourse = async (req, res, next) => {
  try {
    const courseDB = await Course.findOne({ _id: req.params.idCourse });
    if (courseDB.idTraineeRegistered?.length + 1 > limit) {
      return res.redirect("/trainee/listCourse");
    }

    await Courses.updateOne(
      { _id: req.params.idCourse },
      { $push: { idTraineeRegistered: req.id } }
    );

    res.redirect("/trainee/listCourse");
  } catch (err) {
    next(err);
  }
};

const unregisterCourse = async (req, res, next) => {
  try {
    await Courses.updateOne(
      { _id: req.params.idCourse },
      { $pull: { idTraineeRegistered: req.id } }
    );

    res.redirect("/trainee/listCourse");
  } catch (err) {
    next(err);
  }
};

const trainee = {
  showCourses,
  showCoursesInCategory,
  showTrainees,
  searchCourses,
  searchCoursesInCategory,
  searchTrainees,
  viewSchedules,
  searchSchedules,
  listCourse,
  searchlistCourse,
  showListCourseInCategory,
  searchlistCourseInCategory,
  registerCourse,
  unregisterCourse,
};

module.exports = trainee;
