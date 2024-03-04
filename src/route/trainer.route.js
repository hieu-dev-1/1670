const express = require('express');
const router = express.Router();
const trainer = require('../controller/trainer/trainer.controller');

router.get('/showalltrainees/:id', trainer.showTrainees);
router.get('/viewSchedules/:id', trainer.showSchedules);
router.get('/viewSchedules/:id/search', trainer.searchSchedules);
router.get('/viewSchedule/:id/attendance', trainer.viewAttendance);
router.put('/viewSchedule/:id/attendance', trainer.updateAttendance);
router.get('/searchcourses', trainer.searchCourses);
router.get('/searchcourses/:idCategory', trainer.searchCoursesInCategory);
router.get('/searchtrainees/:id/', trainer.searchTrainees);
router.get('/:idCategory', trainer.showCoursesInCategory);
router.get('/', trainer.showCourses);

module.exports = router;