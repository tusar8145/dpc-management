import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at,timeBeauty } from '../helpers/Timer.js';

import jwt from "jsonwebtoken";
import md5 from "md5";

import fs from 'node:fs';
import path  from 'path';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';
import  multer   from 'multer';
import * as response from "../helpers/Response.js";
import { registration } from './UserController.js';
import { create } from '../crud/CrudController.js';
import axios from 'axios';

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads/') // Uploads will be saved in the 'uploads' directory
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname) // File names will be unique
  }
});

const upload = multer({ storage: storage });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
  

export const dashboard_count = async (req, res, next) => {

  //console.log(req.body)

  try {
    const total_3_hospitalized_count = await prisma.dpc_generate.count({
      where: {
        hospital_id:req.body?.hospital_id,
        discharge_date: null,
        OR:[
          {"hospitalization_days": "3"},
        ] 
      }
    });

    const total_7_hospitalized_count = await prisma.dpc_generate.count({
      where: {
        hospital_id:req.body?.hospital_id,
        discharge_date: null,
        OR:[
          {"hospitalization_days": "7"},
        ] 
      }
    });


    const total_hospitalized_count = await prisma.dpc_generate.count({
      where: {
        hospital_id:req.body?.hospital_id,
        discharge_date: null,
      }
    });

    const total_discharge_count = await prisma.dpc_generate.count({
      where: {
        hospital_id:req.body?.hospital_id,
        discharge_date: {
          not: null,
        },
      }
    });

    let result_={
      total_3_hospitalized_count:total_3_hospitalized_count,
      total_7_hospitalized_count:total_7_hospitalized_count,
      total_hospitalized_count:total_hospitalized_count,
      total_discharge_count:total_discharge_count
    }

 

    response.list(result_,res)

} catch (error) {
    response.error(error,res,next)    
}
};



export const dpc_create = async (req, res, next) => {
  try {
    
    let req_data_all=req.body
    
    let collection=[]

    function calculateAge(birthdate) {
        // Convert the birthdate string into a Date object
        const birthDate = new Date(birthdate);
        
        // Get the current date
        const today = new Date();
        
        // Calculate the difference in years
        let age = today.getFullYear() - birthDate.getFullYear();
        
        // Adjust if the birthdate hasn't occurred yet this year
        const monthDifference = today.getMonth() - birthDate.getMonth();
        const dayDifference = today.getDate() - birthDate.getDate();
        if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
            age--;
        }
        
        return age;
    }



    function calculateHospitalizationDays(admissionDate, dischargeDate) {
      const admission = new Date(admissionDate);
      const discharge = new Date(dischargeDate);
      
      // Calculate the difference in time (in milliseconds)
      const differenceInTime = discharge.getTime() - admission.getTime();
      
      // Convert the time difference to days
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      
      return differenceInDays;
    }
    

    


  
 


    for(let x=0; x<req_data_all.length; x++){
        let first_loop_collect=req_data_all[x].first_loop_collect

        let receipt_obj=req_data_all[x].receipt_obj
        let items_obj=req_data_all[x].items_obj
        let amount_obj=req_data_all[x].amount_obj
        let doctor_obj=req_data_all[x].doctor_obj
        let date_obj=req_data_all[x].date_obj
        let dept_obj=req_data_all[x].dept_obj
        let disease_obj=req_data_all[x].disease_obj

        let uid_=first_loop_collect.patient_code.toString()+''+first_loop_collect?.admission_date.replaceAll("/", "")+''+first_loop_collect.hospital_id.toString()
         
        let uid= parseInt(uid_)
        let icd=first_loop_collect.icd_code

        let dpc_6 = ""
          let and_1 = ""
        let age_1 = ""
          let sur_2 = "99"  //depend on surgery data
        let tre1_1 = ""
        let tre2_1 = ""
        let sec_1 = ""
          let sco_1 = ""       



       
        let search = icd
        for(let j=0; j<icd.length-1;j++){
       
   
            search = search.slice(0, -1);
            
            let dpc = await prisma.icd_dpc.findMany({
              where: {
                icd: {contains:search},
              },
            })

            if(dpc.length>0){
                dpc_6=dpc[0].dpc
                j=icd.length-2
            }
            
        }


        //hospitaliation days
            // Example usage
    let  admissionDate = first_loop_collect?.admission_date;
    let  dischargeDate = first_loop_collect?.discharge_date;
    let  treatmentDate = first_loop_collect?.treatment_date

    let hospitalization_days = null

    if(admissionDate && dischargeDate){
      hospitalization_days=calculateHospitalizationDays(admissionDate, dischargeDate).toString()
    }else if (admissionDate && treatmentDate){
      hospitalization_days=calculateHospitalizationDays(admissionDate, treatmentDate).toString()
    }
 
 
        const age = calculateAge(first_loop_collect?.date_of_birth);
        if(age<10){age_1="0"  }else{ age_1="1" }

          let val1=null
          let val2=null
          let val3=null      

        ////////////////////////////////////////////////////////////////////////////////////////////////
       
              for(let m=0; m<items_obj.length; m++){
               let fruit=items_obj[m]

              if(fruit){
                  let find_ = await prisma.treatment_1.findMany({
                    where: {
                      name: {equals:fruit},
                    },
                  }) 
                  
                  if(find_.length>0){
                    //found t1
                    val1=find_[0].corres_code.toString()                 
                  }else{
                        let find_ = await prisma.treatment_2.findMany({
                          where: {
                            name: {equals:fruit},
                          },
                        }) 

                        if(find_.length>0){
                          //found t2
                          val2=find_[0].corres_code.toString()
                        }else{
                              let find_ = await prisma.secondary_injury.findMany({
                                where: {
                                  drug_name: {equals:fruit},
                                },
                              }) 
                              if(find_.length>0){
                                //found t3
                                val3='1'
                              }else{      
                              
                              }        
                        }
                  }                       
                  
              }
 
            }
        //////////////////////////////////////////////////////////////////////////////
  
              if(val1==null){
                val1='X'
              }
              if(val2==null){
                val2='X'
              }
              if(val3==null){
                val3='X'
              }

              let data={
                "hospital_id"     :first_loop_collect.hospital_id,

                "patient_code"	  :first_loop_collect.patient_code,
                "doctor"		      :first_loop_collect.doctor,
                "receipt_obj"	    :"test",
                "items_obj" 	    :"test",
                "amount_obj"	    :"test",
                "ward" 			      :first_loop_collect.ward,
                "icd_code" 		    :first_loop_collect.icd_code,
                "admission_date"  :first_loop_collect?.admission_date?.toString(),	
                "discharge_date"  :first_loop_collect?.discharge_date?.toString(),	
                "treatment_date"  :first_loop_collect?.treatment_date?.toString(),	
                "date_of_birth"   :first_loop_collect?.date_of_birth?.toString(),	

                
                arr_doctor : JSON.stringify(doctor_obj),
                arr_receipt : JSON.stringify(receipt_obj),
                arr_date : JSON.stringify(date_obj),
                arr_name : JSON.stringify(items_obj),
                arr_amount : JSON.stringify(amount_obj),
                arr_dept : JSON.stringify(dept_obj),
                arr_disease : JSON.stringify(disease_obj),


                "dpc_6"  :dpc_6,
                "and_1"  :"X",
                "age_1"  :age_1,
                "sur_2"  :"99",
                "tre1_1" :val1,
                "tre2_1" :val2,
                "sec_1"  :val3,
                "sco_1"  :"X",

                "s_dpc_6"  :null,
                "s_and_1"  :null,
                "s_age_1"  :null,
                "s_sur_2"  :null,
                "s_tre1_1" :null,
                "s_tre2_1" :null,
                "s_sec_1"  :null,
                "s_sco_1"  :null,

                "hospitalization_days" :hospitalization_days,

                "verified_by" :null,
                "verified_at" :"",
                "created_by" :1
              }

 

              //find uid

              //yes? upnade
              // what actually update! dpc code

              const find_ = await prisma.dpc_generate.findUnique({
                where: {
                  uid: uid,
                },
                select:{
                    id  : true,
                    dpc_6  : true,
                    and_1  : true,
                    age_1  : true,
                    sur_2  : true,
                    tre1_1 : true,
                    tre2_1 : true,
                    sec_1  : true,
                    sco_1  : true,

                    s_dpc_6  : true,
                    s_and_1  : true,
                    s_age_1  : true,
                    s_sur_2  : true,
                    s_tre1_1 : true,
                    s_tre2_1 : true,
                    s_sec_1  : true,
                    s_sco_1  : true,

                    arr_doctor: true,
                    arr_receipt: true,
                    arr_date: true,
                    arr_name: true,
                    arr_amount: true,
                    arr_dept: true,
                    arr_disease: true,
                }
              })

              

              

              if(find_){

                /*
                  let n_doctor_obj =find_.arr_doctor+JSON.stringify(doctor_obj)
                    let n_receipt_obj = find_.arr_receipt+JSON.stringify(receipt_obj)
                    let n_date_obj = find_.arr_date+ JSON.stringify(date_obj)
                    let n_items_obj = find_.arr_name+JSON.stringify(items_obj)
                    let n_amount_obj = find_.arr_amount+JSON.stringify(amount_obj)
                    let n_dept_obj = find_.arr_dept+JSON.stringify(dept_obj)
                    let n_disease_obj = find_.arr_disease+JSON.stringify(disease_obj)

                */
                    //update please
                    let n_doctor_obj =JSON.stringify(doctor_obj)
                    let n_receipt_obj = JSON.stringify(receipt_obj)
                    let n_date_obj = JSON.stringify(date_obj)
                    let n_items_obj = JSON.stringify(items_obj)
                    let n_amount_obj = JSON.stringify(amount_obj)
                    let n_dept_obj = JSON.stringify(dept_obj)
                    let n_disease_obj =JSON.stringify(disease_obj)

                    let update_req_data={

                          ...val1?{"tre1_1" :val1,}:{},
                          ...val1?{"tre2_1" :val2,}:{},
                          ...val1?{"sec_1"  :val3,}:{},

                          arr_doctor : n_doctor_obj,
                          arr_receipt : n_receipt_obj, 
                          arr_date : n_date_obj,
                          arr_name : n_items_obj,
                          arr_amount : n_amount_obj, 
                          arr_dept : n_dept_obj,
                          arr_disease : n_disease_obj,
                          
                        ...first_loop_collect.discharge_date?{"discharge_date"  :first_loop_collect?.discharge_date?.toString(),}:{},
                        ...hospitalization_days?{"hospitalization_days" :hospitalization_days,}:{},

                    }

                    const updateUser = await prisma.dpc_generate.update({
                      where: {
                        id: find_.id,
                      },
                      data: update_req_data,
                    }) 


              }
              else{
                  let cre_ = await prisma.dpc_generate.create({
                    data: {
                      ...data,
                      uid: uid,
                    },
                  })
              } 
             


              //no? create



        /*const upsertDpcGenerate = await prisma.dpc_generate.upsert({
          where: {
            uid: uid,
          },
          update: data,
          create: {
           ...data,
           uid: uid,
          },
        })*/

        //collection.push(data)
    }


    /*const newUser = await prisma.dpc_generate.createMany({
      data:collection,
    });*/

    
      response.create([],res)
  } catch (error) {
      response.error(error,res,next)    
  }
};




export const dpc_update_code = async (req, res, next) => {
  try {
    let up=0
    console.log(req.body)

    let surgery=req.body.data
    for(let x=0; x<surgery.length; x++){
      let this_=surgery[x]

          let temp1 = await prisma.surgery.findMany({
            where: {
              k_code: this_.k_code
            },
          })


          if(temp1.length>0){
            up++
              let temp2 = await prisma.dpc_generate.updateMany({
                where:{
                  patient_code:this_.patient_code
                },
                data: {
                  s_sur_2:temp1[0].code
                },
              })            
          }
    }

    //console.log('up',up)
    response.update([],res)
  } catch (error) {
    response.error(error,res,next)    
}
};


export const dpc_update = async (req, res, next) => {
  try {
    //console.log(req.body['key'])

    let data=null
    if(req.body['key']=='dpc_6'){  data={dpc_6:req.body.value}  }
    if(req.body['key']=='and_1'){  data={and_1:req.body.value}  }
    if(req.body['key']=='age_1'){  data={age_1:req.body.value}  }
    if(req.body['key']=='sur_2'){  data={sur_2:req.body.value}  }
    if(req.body['key']=='tre1_1'){ data={tre1_1:req.body.value}  }
    if(req.body['key']=='tre2_1'){  data={tre2_1:req.body.value}  }
    if(req.body['key']=='sec_1'){  data={sec_1:req.body.value}  }
    if(req.body['key']=='sco_1'){  data={sco_1:req.body.value}  }

    const update = await prisma.dpc_generate.update({
      where: { id: req.body.id },  
      data: data,
    });

    response.update([],res)
  } catch (error) {
      response.error(error,res,next)    
  }
};



export const dpc_verify = async (req, res, next) => {
  try {
    console.log(req.body)
    const update = await prisma.dpc_generate.update({
      where: { id: req.body.id }, // specify the unique identifier of the record to update
      data: {
        is_verified: req.body.is_verified, // specify the fields to update
      },
    });

    response.update(update,res)
  } catch (error) {
      response.error(error,res,next)    
  }
};


export const dpc_list = async (req, res, next) => {
  try {

    let filter = req.body?.filter
    let is_verified = req.body?.is_verified
 
 

      let result_=await prisma.dpc_generate.findMany({
          ...response.list_paginate(req),
          where: {
            ...filter ? { ...filter } : {},
            hospital_id:req.body?.hospital_id,
            ...is_verified==1?{is_verified:1}:{},
            ...is_verified==0?{is_verified:0}:{},
          },
          select:{
            id:true,
            "hospital_id"     :true,
            "patient_code"	  :true,
            "doctor"		      :true,
            "receipt_obj"	    :true,
            "items_obj" 	    :true,
            "amount_obj"	    :true,
            "ward" 			      :true,
            "icd_code" 		    :true,
            "admission_date"  :true,
            "discharge_date"  :true,
            "treatment_date"  :true,
            "date_of_birth"   :true,
  
            "dpc_6"  :true,
            "and_1"  :true,
            "age_1"  :true,
            "sur_2"  :true,
            "tre1_1" :true,
            "tre2_1" :true,
            "sec_1"  :true,
            "sco_1"  :true,

            "s_dpc_6"  :true,
            "s_and_1"  :true,
            "s_age_1"  :true,
            "s_sur_2"  :true,
            "s_tre1_1" :true,
            "s_tre2_1" :true,
            "s_sec_1"  :true,
            "s_sco_1"  :true,

  
            "hospitalization_days" :true,

            "is_verified" :true,
            "verified_by" :true,
            "verified_at" :true,
            "created_by" :true,

            arr_doctor: true,
            arr_receipt: true,
            arr_date: true,
            arr_name: true,
            arr_amount: true,
            arr_dept: true,
            arr_disease: true,

          }
        })


        const groupBy = await prisma.dpc_generate.groupBy({
          by: ['is_verified'],
          _count: {
            is_verified: true,
          },
          where:{
            hospital_id:req.body?.hospital_id,
          }
        })

         
   
      response.list({list:result_, count:groupBy},res)
  } catch (error) {
      response.error(error,res,next)    
  }
};





export const image =   async (req, res, next) => {
  let image = req.params.image
  res.sendFile(path.join(__dirname.replace("\controllers", "") + "./uploads/"+image));
};


export const manage_logo =   async (req, res, next) => {
 
  const uploadDir = path.join(__dirname.replace("\controllers", "") + '/uploads'); 
 
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, '0777', true);
  const customOptions = { uploadDir: uploadDir, keepExtensions: true, allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 * 1024, multiples: true };
  const form = new IncomingForm(customOptions);
 // console.log(form)
  let file_count = req.query.counts

  let id=parseInt(req.query.id)

  form.parse(req, async (err, fields, files) => {
    if (err) {
      next(err);
      return;
    }
    for (let x = 0; x < file_count; x++) {
      try {

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


        //console.log(newFilepath_1, newFilepath, 'newFilepath')
        fs.rename(newFilepath_1, newFilepath, err => err);


        //update hospital db
        const updatedHospital = await prisma.hospitals.update({
          where: { id: id },
          data: { logo: trimmedStr },
        });


      } catch (error) {
        console.log(error, 'error')
      }


      //console.log(file.name,'file-'+x.toString())
    }
    res.status(200).json({});
  });
};

export const manage_update = async (req, res, next) => {
  try {
    let clock=created_at()
 
    //admin update
    let name=req.body.admin_name
    let email=req.body.admin_email
    let phone=req.body.admin_phone

    let password=null
    if(req.body.admin_password){
      password=req.body.admin_password
    }
    
    //hospital update
    let id=req.body.id
    let h_name=req.body.name
    let h_address=req.body.address
    let updated_at=clock
    let updated_by=user_id

 
    const filterhospitals = await prisma.hospitals.findMany({
      where: {
        id:id,
      },
    });


    const update1 = await prisma.admins.updateMany({
      where: {
        id: filterhospitals[0].admin_id,
      },
      data: {
         name:name,
         email:email,
         phone:phone,
        ...password?{password:md5(password)}:{},
      },
    });

    const update2 = await prisma.hospitals.updateMany({
      where: {
        id: id,
      },
      data: {
         name:h_name,
         address:h_address,
         updated_at:updated_at,
         updated_by:updated_by,
      },
    });
 

      response.list([],res)
  } catch (error) {
      response.error(error,res,next)    
  }
};


export const manage_remove = async (req, res, next) => {
  try {
    let admin_email=req.body.admin_email
    //remove admin
    let delete_first = await prisma.hospitals.delete({
      where: {
         id: req.body.id 
      },
    })
    
 
    //if success remove hospital
    let  delete_ =null
    if(delete_first){
        let  delete_ =  await prisma.admins.delete({
          where: {
             email: admin_email 
          },
        })

        if(delete_){}else{
            //create again
            const newCreate = await prisma.user.create({
              data: {
              ...delete_first
              },
            });
        }
    }else{


    } 
  
      response.remove(delete_,res)
  } catch (error) {
      response.error(error,res,next)    
  }
};

