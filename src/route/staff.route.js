const express = require('express');
const router = express.Router();
const authenticate = require('../middleware/auth.middleware')


const staffController = require('../controller/staff/staff.controller');

// Router CATEGORY  
router.get('/viewCategory/create', staffController.category.create);
router.post('/viewCategory/store', staffController.category.store);
router.get('/viewCategory/search', staffController.category.search);
router.get('/viewCategory/:id/edit', staffController.category.edit);
router.put('/viewCategory/:id', staffController.category.update);
router.delete('/viewCategory/:id', staffController.category.destroy);
router.get('/viewCategory', staffController.category.show);

// Router COURSES  
router.get('/viewCourses/create', staffController.course.create);
router.post('/viewCourses/store', staffController.course.store);
router.get('/viewCourses/search', staffController.course.search);
router.get('/viewCourses/:id/edit', staffController.course.edit);
router.post('/viewCourses/:id/addTrainee', staffController.course.addTrainee);
router.get('/viewCourses/:id/viewAddTrainee', staffController.course.viewAddTrainee);
router.post('/viewCourses/:id/addTrainer', staffController.course.addTrainer);
router.get('/viewCourses/:id/viewAddTrainer', staffController.course.viewAddTrainer);
router.put('/viewCourses/:id', staffController.course.update);
router.delete('/viewCourses/:id', staffController.course.destroy);
router.get('/viewCourses/trash/store', staffController.course.storeTrash);
router.patch('/viewCourses/:id/restore', staffController.course.restore);
router.delete('/viewCourses/:id/force', staffController.course.deleteForce);
router.delete('/viewCourses/:id/deleteTrainee/:idTrainee', staffController.course.deleteTrainee);
router.delete('/viewCourses/:id/deleteTrainer/:idTrainer', staffController.course.deleteTrainer);
router.get('/searchAddTrainer/:id', staffController.course.searchAddTrainer);
router.get('/searchAddTrainee/:id', staffController.course.searchAddTrainee);
router.get('/viewCourses/:id', staffController.course.showDetail);
router.get('/viewCourses',staffController.course.show);

// Router STUDENT
router.get('/viewStudent/create', staffController.student.create);
router.post('/viewStudent/store', staffController.student.store);
router.get('/viewStudent/:id/edit', staffController.student.edit);
router.put('/viewStudent/:id', staffController.student.update);
router.delete('/viewStudent/:id', staffController.student.deleteS);
router.get('/viewStudent/search', staffController.student.search);
router.get('/viewStudent', staffController.student.show);

// Router SLOT
router.get('/viewSlot/create', staffController.slot.create);
router.post('/viewSlot/store', staffController.slot.store);
router.get('/viewSlot/:id/edit', staffController.slot.edit);
router.put('/viewSlot/:id', staffController.slot.update);
router.delete('/viewSlot/:id', staffController.slot.destroy);
router.get('/viewSlot/search', staffController.slot.search);
router.get('/viewSlot', staffController.slot.show);

// Router SCHEDULES
router.get('/viewSchedule/create', staffController.schedule.create);
router.post('/viewSchedule/store', staffController.schedule.store);
router.get('/viewSchedule/:id/edit', staffController.schedule.edit);
router.put('/viewSchedule/:id', staffController.schedule.update);
router.delete('/viewSchedule/:id', staffController.schedule.destroy);
router.get('/viewSchedule/search', staffController.schedule.search);
router.get('/viewSchedule/:id', staffController.schedule.detail);
router.put('/viewSchedule/:id/attendance', staffController.schedule.attendance);
router.get('/viewSchedule', staffController.schedule.show);

//Router STAFF
router.get('/',staffController.index);

module.exports = router;