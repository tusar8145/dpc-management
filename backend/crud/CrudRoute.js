import express from "express";
import * as CrudController from "./CrudController.js";
const router = express.Router();

router.post("/crud/:table/create", CrudController.create);
router.post("/crud/:table/update", CrudController.update);
router.post("/crud/:table/list", CrudController.list);
router.post("/crud/:table/count", CrudController.count);
router.post("/crud/:table/remove", CrudController.remove);
router.post("/crud/:table/remove-all", CrudController.remove_all);

export { router as CrudRoute };



 