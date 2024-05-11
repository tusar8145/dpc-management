import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cluster from  'cluster';
import os from 'os';
import cors from "cors" 
import { CrudRoute } from "./crud/CrudRoute.js";

import { UserRoute } from "./routes/UserRoute.js";
import { HospitalRoute } from "./routes/HospitalRoute.js";

const app = express();
const SYSVERSION = "/api/";

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

 

const corsOptions ={
   origin:'*', 
   credentials:true,            //access-control-allow-credentials:true
   optionSuccessStatus:200,
}

app.use(cors(corsOptions))  

app.use(SYSVERSION, UserRoute);
app.use(SYSVERSION, HospitalRoute);
app.use(SYSVERSION, CrudRoute);

app.use((req, res, next) => {
  res.status(404).json({
    message: "404 not found",
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port: ${process.env.PORT}`);
});
