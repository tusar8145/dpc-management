import express from "express";
import { auth } from "../middleware/Auth.js";
import * as HospitalController from "../controllers/HospitalController.js";  //*1
const router = express.Router();
 
router.post("/hospital/illness",   HospitalController.illness);
 


export { router as HospitalRoute };  



 