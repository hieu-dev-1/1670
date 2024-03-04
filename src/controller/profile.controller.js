const users = require("../model/users.model");
const bcrypt = require("bcryptjs");
const User = users.model;

const show = async (req, res, next) => {
  let user;
  await User.findOne({ _id: req.id }).then(function (result) {
    if (!result) return res.send(401);
    user = {
      email: result.email,
      name: result.name,
      age: result.age,
      avatar: result.avatar,
      phone: result.phone,
      address: result.address,
      role: result.role,
    };
  });
  res.render("profile/index", {
    user,
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email
  });
};

const changePassword = async (req, res, next) => {
  try {
    const newPasswordLength = req.body.newPassword.length;
    const user = await User.findOne({ _id: req.id })
    if (!user) return res.send(401);
    if (!bcrypt.compareSync(req.body.password, user.password))
      return res.render('profile/viewChangePassword', {
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        newPassword: req.body.newPassword,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
        passwordError: true,
      })
    if (req.body.confirmPassword !== req.body.newPassword)
      return res.render('profile/viewChangePassword', {
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        newPassword: req.body.newPassword,
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
        confirmPasswordError: true,
      })
    if (newPasswordLength >= 6 && req.body.password !== req.body.newPassword) {
      const salt = bcrypt.genSaltSync(10);
      let passwordHash = bcrypt.hashSync(req.body.newPassword, salt);
      await User.updateOne({ _id: req.id }, { password: passwordHash })
      res.redirect("/logout")
    } else {
      return res.render('profile/viewChangePassword', {
        rolePage: req.rolePage,
        password: req.body.password,
        confirmPassword: req.body.confirmPassword,
        newPassword: req.body.newPassword,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email,
        newPasswordError: true,
      })
    }
  } catch (err) {
    next(err);
  }
};
const viewChangePassword = async (req, res, next) => {
  res.render('profile/viewChangePassword', {
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email
  })
}
const viewUpdate = async (req, res, next) => {
  const user = await User.findOne({ _id: req.id })

  res.render('profile/viewUpdate', {
    user,
    role: req.role,
    rolePage: req.rolePage,
    link: `/${req.role}`,
    avatar: req.avatar,
    email: req.email
  })
}
const updateTrainee = async (req, res, next) => {
  try{
    if(req.file){
      const avatar = req.file.filename;
      await User.updateOne(
        { $and: [{ _id: req.id }, { role: "trainee" }] },
        {
          avatar
        }
      )
      req.session.user.avatar = avatar;
    }
    res.redirect("/profile");
  }catch(err){
    next(err);
  }
}
const updateAll = async (req, res, next) => {
  try{
    if(req.file){
      const avatar = req.file.filename;
      await User.updateOne(
        { _id: req.id },
        {
          avatar,
          phone: req.body.phone,
          address: req.body.address,
          age: req.body.age,
          name: req.body.name,
        }
      )
      req.session.user.avatar = avatar;
    }else{
      await User.updateOne(
        { _id: req.id },
        {
          phone: req.body.phone,
          address: req.body.address,
          age: req.body.age,
          name: req.body.name,
        }
      )
    }
    res.redirect('/profile');
  }catch(err){
    next(err);
  }
}

const profile = {
  show,
  changePassword,
  viewChangePassword,
  viewUpdate,
  updateTrainee,
  updateAll
}

module.exports = profile;
