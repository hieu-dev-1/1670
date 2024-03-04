const Slots = require("../../model/slots.model").model;
const Categories = require("../../model/categories.model").model;

//[GET] /staff/viewSlot/create
const create = async (req, res, next) => {
  const categories = await Categories.find({});
  res.render("staff/slots/createSlot", {
    rolePage: req.rolePage,
    categories: categories,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email,
  });
};

//[POST] /staff/viewSlot/store
const store = async (req, res, next) => {
  try {
    await new Slots(req.body).save();
    return res.redirect("/staff/viewSlot");
  } catch (err) {
    return res.render("staff/slots/createSlot", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[GET] /staff/viewSlot
const show = async (req, res, next) => {
  try {
    let slots = await Slots.find();

    return res.render("staff/slots/viewSlot", {
      count: slots.length,
      slots: slots,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    return next(err);
  }
};

//[GET] /staff/viewSlot/:id/edit
const edit = async (req, res, next) => {
  try {
    let slot = await Slots.findOne({ _id: req.params.id });
    const categories = await Categories.find({});
    res.render("staff/slots/editSlot", {
      slot: slot,
      categories: categories,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    return res.render("staff/slots/editSlot", {
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[PUT] /staff/viewSlot/:id
const update = async (req, res, next) => {
  try {
    await Slots.updateOne({ _id: req.params.id }, req.body);
    return res.redirect("/staff/viewSlot");
  } catch (err) {
    let student = await Slots.findOne({ _id: req.params.id });
    res.render("staff/slots/editSlot", {
      student: student,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
      addFailed: true,
    });
  }
};

//[DELETE] /staff/viewSlot/:id
const destroy = async (req, res, next) => {
  try {
    let student = await Slots.deleteOne({ _id: req.params.id });
    res.redirect("/staff/viewSlot");
  } catch (err) {
    next(err);
  }
};

//[GET] /staff/viewSlot/search
const search = async (req, res, next) => {
  try {
    let slot = await Slots.findOne({ name: req.query.search });
    if (slot) {
      return res.render("staff/slots/viewSlot", {
        count: 1,
        slot: slot,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
      });
    }
    const searchSlot = new RegExp(req.query.search, "i");
    let slots = await Slots.find({ name: searchSlot });
    res.render("staff/slots/viewSlot", {
      count: slots.length,
      slots: slots,
      rolePage: req.rolePage,
      link: `/${req.role}`,
      avatar: req.avatar,
      email: req.email,
    });
  } catch (err) {
    next(err);
  }
};

const slot = {
  create,
  store,
  show,
  edit,
  update,
  destroy,
  search,
};

module.exports = slot;
