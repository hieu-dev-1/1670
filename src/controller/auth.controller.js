const users = require("../model/users.model");
const bcrypt = require("bcryptjs");
const User = users.model;

const loginView = (req, res, next) => {
  res.render("login/index");
};

const login = async (req, res, next) => {
  try {
    const userInDB = await User.findOne({ email: req.body.email })
    if (
      !userInDB ||
      !bcrypt.compareSync(req.body.password, userInDB.password)
    ) {
      return res.render('login/index', {
        failedLogin: true,
      })
    }
    const userData = {
      id: userInDB.id,
      email: userInDB.email,
      role: userInDB.role,
      avatar: userInDB.avatar,
    };

    req.session.user = userData;

    const role = userData.role;
    switch (role) {
      case "admin":
        res.redirect("/admin");
        break;
      case "staff":
        res.redirect("/staff");
        break;
      case "trainer":
        res.redirect("/trainer");
        break;
      case "trainee":
        res.redirect("/trainee");
        break;
      default:
        res.redirect("/profile");
        break;
    }
    next();
  } catch (err) {
    next(err);
  }
};
const logout = async (req, res, next) => {
  try {
    req.session.destroy();
    res.redirect("/");
  } catch (err) {
    console.log(`Function : logout`);
    console.log(err);
  }
};

const auth = {
  login,
  logout,
  loginView,
};
module.exports = auth;
