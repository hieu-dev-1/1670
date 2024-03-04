const express = require("express");
const router = express.Router();

const adminController = require("../controller/admin/admin.controller");

router.get("/viewTrainer/get-create", adminController.trainer.getCreate);
router.post("/viewTrainer/create", adminController.trainer.create);
router.get("/viewTrainer/search", adminController.trainer.search);
router.get("/viewTrainer/:id/edit", adminController.trainer.edit);
router.put("/viewTrainer/:id", adminController.trainer.update);
router.get("/viewTrainer/:id/view", adminController.trainer.view);
router.get(
  "/viewTrainer/:id/viewAddCategory",
  adminController.trainer.viewAddCategory
);
router.post(
  "/viewTrainer/:id/addCategory",
  adminController.trainer.addCategory
);
router.delete(
  "/viewTrainer/:id/deleteCategory/:categoryId",
  adminController.trainer.deleteCategory
);
router.delete("/viewTrainer/:id", adminController.trainer.deleteS);
router.get("/viewTrainer", adminController.trainer.show);

router.get("/viewStaff/get-create", adminController.staff.getCreate);
router.post("/viewStaff/create", adminController.staff.create);
router.get("/viewStaff/search", adminController.staff.search);
router.get("/viewStaff/:id/edit", adminController.staff.edit);
router.put("/viewStaff/:id", adminController.staff.update);
router.delete("/viewStaff/:id", adminController.staff.deleteS);
router.get("/viewStaff", adminController.staff.show);

//Router STAFF
router.get("/", adminController.index);

module.exports = router;
