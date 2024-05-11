import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';

import jwt from "jsonwebtoken";
import md5 from "md5";

import fs from 'node:fs';
import path  from 'path';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';
import  multer   from 'multer';
import * as response from "../helpers/Response.js";

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads/')
 },
 filename: function (req, file, cb) {
   const uniqueSuffix = file.originalname
   cb(null, uniqueSuffix)
 }
})


const upload = multer({ storage: storage })

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  
export const illness = async (req, res, next) => {
    try {
        let result=await prisma.injuries.findMany({
            ...response.list_paginate(req)
          })

        response.list(result,res)
    } catch (error) {
        response.error(error,res,next)    
    }
};

 

 

