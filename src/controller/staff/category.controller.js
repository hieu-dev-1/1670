const Categories = require("../../model/categories.model").model;
const Courses = require("../../model/courses.model").model;

//[GET] /staff/viewCategory/create
const create = (req, res, next) => {
  res.render("staff/categories/createCategory", {
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email,
  });
};

//[POST] /staff/viewCategory/store
const store = async (req, res, next) => {
  try {
    await new Categories({
      name: req.body.name,
    }).save();
    res.redirect("/staff/viewCategory");
  } catch (err) {
    res.render("staff/categories/createCategory", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[GET] /staff/viewCategory
const show = async (req, res, next) => {
  try {
    const categories = await Categories.find({});
    let dateNow;
    let count = 0;
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
      count++;
    }
    res.render("staff/categories/viewCategory", {
      count,
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

//[GET] /staff/viewCategory/:id/edit
const edit = async (req, res, next) => {
  try {
    const category = await Categories.findOne({ _id: req.params.id });
    res.render("staff/categories/editCategory", {
      category: category,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

//[PUT] /staff/viewCategory/:id
const update = async (req, res, next) => {
  try {
    await Categories.updateOne({ _id: req.params.id }, req.body);
    res.redirect("/staff/viewCategory");
  } catch (err) {
    const category = await Categories.findOne({ _id: req.params.id });
    res.render("staff/categories/editCategory", {
      category: category,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[GET] /staff/viewCategory/search
const search = async (req, res, next) => {
  try {
    const category = await Categories.findOne({
      name: req.query.search.trim(),
    });
    let categories;
    let dateNow;
    let count = 0;
    if (category) {
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
    } else {
      const searchCategory = new RegExp(req.query.search.trim(), "i");
      categories = await Categories.find({ name: searchCategory });
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
        count++;
      }
    }
    res.render("staff/categories/viewCategory", {
      count: category ? 1 : count,
      category: category,
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

//[DELETE] /staff/viewCategory/:id
const destroy = async (req, res, next) => {
  try {
    let courses = await Courses.find({ idCategory: req.params.id });
    let messageError = "Không thể xóa";
    if (courses.length) {
      // return res.send(
      //   "A course already exists in this category. Please delete the course first"
      // );
      const categories = await Categories.find({});
      let dateNow;
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
      return res.render("staff/categories/viewCategory", {
        messageError,
        categories: categories,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
      });
    }
    await Categories.deleteOne({ _id: req.params.id });
    res.redirect("/staff/viewCategory");
  } catch (err) {
    next(err);
  }
};

const category = {
  create,
  store,
  show,
  edit,
  update,
  search,
  destroy,
};

module.exports = category;
