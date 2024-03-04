const Categories = require("../../model/categories.model").model;
const Users = require("../../model/users.model").model;
const Trainers = require("../../model/users.model").model;

const view = async (req, res) => {
  try {
    let trainer = await Trainers.findOne({ _id: req.params.id });
    let categories =
      (await Categories.find({ idTrainer: req.params.id })) || [];
    for (let category of categories) {
      let date = new Date(category.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      category.dateCreated = dateNow;
    }
    res.render("admin/trainer/detailTrainer", {
      trainer: trainer,
      categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    return res.render("admin/trainer/detailTrainer", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

const show = async (req, res, next) => {
  const trainers = await Trainers.find({ role: "trainer" });
  let count = 0;
  let dateNow;
  for (let trainer of trainers) {
    let date = new Date(trainer.createdAt * 1000);
    if (date.getSeconds() < 10) {
      dateNow = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
    } else {
      dateNow = `${date.getDate()}/${
        date.getMonth() + 1
      }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    }
    let categoriesName = [];
    let categories = (await Categories.find({ idTrainer: trainer._id })) || [];
    for (let category of categories) {
      categoriesName.push(category.name);
    }

    trainer.categoriesName = categoriesName;
    trainer.dateCreated = dateNow;
    count++;
  }
  return res.render("admin/trainer/viewTrainer", {
    count: count,
    trainers: trainers,
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email,
  });
};
const getCreate = async (req, res) => {
  return res.render("admin/trainer/createTrainer", {
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email,
  });
};

const create = async (req, res) => {
  try {
    await new Trainers({
      name: req.body.name,
      email: req.body.email,
      age: req.body.age,
      phone: req.body.phone,
      address: req.body.address,
      role: "trainer",
    }).save();
    return res.redirect("/admin/viewTrainer");
  } catch (err) {
    return res.render("admin/trainer/createTrainer", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

const edit = async (req, res, next) => {
  try {
    let trainer = await Trainers.findOne({ _id: req.params.id });
    res.render("admin/trainer/editTrainer", {
      trainer: trainer,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    return res.render("admin/trainer/editTrainer", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

const update = async (req, res, next) => {
  try {
    await Trainers.updateOne({ _id: req.params.id }, req.body);
    return res.redirect("/admin/viewTrainer");
  } catch (err) {
    let trainer = await Trainers.findOne({ _id: req.params.id });
    res.render("admin/trainer/editTrainer", {
      trainer: trainer,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

const deleteS = async (req, res, next) => {
  Trainers.deleteOne({ _id: req.params.id })
    .then(() => {
      res.redirect("/admin/viewTrainer");
    })
    .catch(next);
};

//[GET] /adminh/viewTrainer/search
const search = async (req, res, next) => {
  try {
    let trainer = await Trainers.findOne({
      $and: [{ name: req.query.search }, { role: "trainee" }],
    });
    let trainers;
    let dateNow;
    if (trainer) {
      let date = new Date(trainer.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }

      let categoriesName = [];
      let categories =
        (await Categories.find({ idTrainer: trainer._id })) || [];
      for (let category of categories) {
        categoriesName.push(category.name);
      }

      trainer.categoriesName = categoriesName;
      trainer.dateCreated = dateNow;
    }
    if (trainer) {
      return res.render("admin/trainer/viewTrainer", {
        count: 1,
        trainer: trainer,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
      });
    }
    const searchTrainer = new RegExp(req.query.search, "i");
    trainers = await Trainers.find({
      $and: [{ name: searchTrainer }, { role: "trainer" }],
    });
    let count = 0;
    for (let trainer of trainers) {
      let date = new Date(trainer.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      let categoriesName = [];
      let categories =
        (await Categories.find({ idTrainer: trainer._id })) || [];
      for (let category of categories) {
        categoriesName.push(category.name);
      }

      trainer.categoriesName = categoriesName;

      trainer.dateCreated = dateNow;
      count++;
    }
    res.render("admin/trainer/viewTrainer", {
      count,
      trainers: trainers,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const viewAddCategory = async (req, res, next) => {
  try {
    const trainer = await Users.findOne({ _id: req.params.id });
    const categories = await Categories.find({});
    const categoriesOutTrainer = [];
    for (let category of categories) {
      let date = new Date(category.createdAt * 1000);
      if (date.getSeconds() < 10) {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:0${date.getSeconds()}`;
      } else {
        dateNow = `${date.getDate()}/${
          date.getMonth() + 1
        }/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
      }
      category.dateCreated = dateNow;

      let categoryIdTrainer = category.idTrainer.some((idTrainer) => {
        return idTrainer == trainer._id;
      });
      if (!categoryIdTrainer) {
        categoriesOutTrainer.push(category);
      }
    }
    res.render("admin/trainer/addCategory", {
      trainer,
      categories: categoriesOutTrainer,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

//[POST] /admin/viewTrainer/:id/addTrainee
const addCategory = async (req, res, next) => {
  try {
    for (const id of req.body.categoriesIds) {
      await Categories.updateOne(
        { _id: id },
        { $push: { idTrainer: req.params.id } }
      );
    }
    res.redirect(`/admin/viewTrainer/${req.params.id}/view`);
  } catch (err) {
    next(err);
  }
};

const deleteCategory = async (req, res, next) => {
  try {
    await Categories.updateOne(
      { _id: req.params.categoryId },
      { $pull: { idTrainer: req.params.id } }
    );
    res.redirect(`/admin/viewTrainer/${req.params.id}/view`);
  } catch (err) {
    console.log(err);
    next(err);
  }
};
const trainer = {
  show,
  create,
  getCreate,
  edit,
  update,
  deleteS,
  search,
  view,
  viewAddCategory,
  addCategory,
  deleteCategory,
};

module.exports = trainer;
