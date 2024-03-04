const category = require('./category.controller')
const course = require('./course.controller')
const student = require('./student.controller')
const slot = require('./slot.controller')
const schedule = require('./schedule.controller')

//[GET] /staff
const index = (req, res, next) => {
    // console.log(req.email)
    res.render('staff/index',{
        rolePage: req.rolePage,
        link: `/${req.role}`,
        avatar: req.avatar,
        email: req.email
    });
}




const staff = {
    index,
    category,
    course,
    student,
    slot,
    schedule
}
module.exports = staff;