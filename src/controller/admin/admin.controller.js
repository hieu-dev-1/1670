const trainer = require("./trainer.controller");
const staff = require("./staff.controller");

// Đưa vào trang quản lý
const index = (req, res, next) => {
  // console.log(req.email)
  res.render("admin/index", {
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email,
  });
};

const admin = {
  index,
  trainer,
  staff,
};
module.exports = admin;
