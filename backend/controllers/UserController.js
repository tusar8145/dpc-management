import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at } from '../helpers/Timer.js';
import * as response from "../helpers/Response.js";
import jwt from "jsonwebtoken";
import md5 from "md5";

import fs from 'node:fs';
import path  from 'path';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';
import  multer   from 'multer';

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
 

export const uploads = async (req, res, next) => {
    try {
console.log(req);

        //app.post('/api/pod/:counts', async (req, res, next) => {
           //console.log('99999999999999999999999999999999999999999999999999999999999999',req.params.counts);
             const uploadDir = path.join(__dirname + '/uploads'); 
             if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, '0777', true);
             const customOptions = { uploadDir: uploadDir, keepExtensions: true, allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 * 1024, multiples: true };
             const form = new IncomingForm(customOptions);
 
             let file_count = req.params.counts
            
             form.parse(req, (err, fields, files) => {
               if (err) {
                console.log('eeeee');
                 next(err);
                 return;
               }
               for (let x = 0; x < file_count; x++) {
                 try {
           //console.log(x);
                   const file = files['file-' + x.toString()]
                   let str = file.toString()
                   const myArray = str.split(",");
           
           
                   const ssmyArray1 = myArray[1].split(":");
                   var trimmedStr = ssmyArray1[1].trimStart();
                   trimmedStr = trimmedStr.trimEnd();
                   const newFilepath = `${uploadDir}/${trimmedStr}`;
           
           
           
                   const ssmyArray1_1 = myArray[0].split(":");
                   var trimmedStr_1 = ssmyArray1_1[1].trimStart();
                   trimmedStr_1 = trimmedStr_1.trimEnd();
                   const newFilepath_1 = `${uploadDir}/${trimmedStr_1}`;
           
           
                   console.log(newFilepath_1, newFilepath, 'newFilepath')
                   fs.rename(newFilepath_1, newFilepath, err => err);
           
                 } catch (error) {
                   console.log(error, 'error')
                 }
           
           
                 //console.log(file.name,'file-'+x.toString())
               }
               res.status(200).json({});
             });
          

    } catch (error) {
        next(error)
    }
};


export const login = async (req, res, next) => {
    try {
        const req_data = req.body

        const email = req.body.email;
        const password = req.body.password;

        if (!email.length > 2 && !password.length > 2) {
            res.status(401).json({
                success: false,
                message: "unauthorize",
            });
        }

        var admins = null;
        admins = await prisma.admins.findMany({
            where: {
                email: email,
                password: md5(password),
            },
        });

        if (Object.keys(admins).length > 0) {
            const authorization = jwt.sign(
                { ...admins[0] },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_VALIDITY }
            );

            let this_user = admins[0]
            res.status(200).json(
                {


                    "user": {
                        "uid": this_user.id,
                        "role": this_user.role,
                        "data": {
                            "displayName": this_user.name,
                            "photoURL": "assets/images/avatars/brian-hughes.jpg",
                            "email": this_user.email,
                            "settings": {
                                "layout": {},
                                "theme": {}
                            },
                            "shortcuts": [
                                "apps.calendar",
                                "apps.mailbox",
                                "apps.contacts"
                            ]
                        },
                        "title": "hi"
                    },
                    "access_token": authorization

                }
            );

        } else {
            res.status(404).json({
                success: false,
                getadmin: admins,
            });
        }
    } catch (error) {
        next(error)
    }
};

export const refresh = async (req, res, next) => {
    try {

        let token = req.headers.authorization;
        token = token.split(" ")[1];
        let user = jwt.verify(token, process.env.JWT_SECRET);
        res.status(200).json(
            {

                "uid": user.id,
                "role": user.role,
                "data": {
                    "displayName": user.name,
                    "photoURL": "assets/images/avatars/brian-hughes.jpg",
                    "email": user.email,
                    "settings": {
                        "layout": {},
                        "theme": {}
                    },
                    "shortcuts": [
                        "apps.calendar",
                        "apps.mailbox",
                        "apps.contacts"
                    ]
                }
            }
        );

    } catch (error) {
        next(error)
    }
};



export const registration = async (req, res, next) => {
    try {
        const { name, password, email, phone, role } = req.body;

        // Check if the email is already in use
        const existingadmin = await prisma.admins.findUnique({
            where: {
                email: email,
            },
        });

        if (existingadmin) {
            return res.status(400).json({ success: false, message: 'Email already in use' });
        }

        // Hash the password
        // Save the admin to the database
        const addadmin = await prisma.admins.create({
            data: {
                name: name,
                email: email,
                phone: phone,
                role: role,
                password: md5(password),
            },
        });

        // Create a JWT token
        const authorization = jwt.sign({ id: addadmin.id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_VALIDITY });

        return res.status(200).json({
            success: true,
            message: "admin created successfully!",
            authorization: authorization,
            id: addadmin.id,
        });


    } catch (error) {
        next(error)
    }
}; 

