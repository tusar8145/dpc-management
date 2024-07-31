import { PrismaClient } from '@prisma/client';

import { user_id } from '../middleware/Auth.js';
import { rand } from '../helpers/RandomHash.js';
import { currentTimeValue } from '../helpers/Timer.js';
const prisma = new PrismaClient();
import { created_at, timeBeauty, timeStable } from '../helpers/Timer.js';

import jwt from "jsonwebtoken";
import md5 from "md5";

import fs from 'node:fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { IncomingForm } from 'formidable';
import multer from 'multer';
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



  let d1=timeStable(created_at())
  let d2=timeStable(created_at(3))
  let d3=timeStable(created_at(7))

// console.log(d2,'d2')

  try {
 
    const total_3_hospitalized_count = await prisma.dpc_generate.count({
      where: {
        hospital_id: req.body?.hospital_id,
        discharge_date: null,
        admission_date: d2,
      }
    });



    const total_7_hospitalized_count = await prisma.dpc_generate.count({
      where: {
        hospital_id: req.body?.hospital_id,
        discharge_date: null,
        admission_date: d3,
      }
    });


    const total_hospitalized_count = await prisma.dpc_generate.count({
      where: {
        hospital_id: req.body?.hospital_id,
        discharge_date: null,
      }
    });

    const total_discharge_count = await prisma.dpc_generate.count({
      where: {
        hospital_id: req.body?.hospital_id,
        discharge_date: {
          not: null,
        },
      }
    });

    let result_ = {
      total_3_hospitalized_count: total_3_hospitalized_count,
      total_7_hospitalized_count: total_7_hospitalized_count,
      total_hospitalized_count: total_hospitalized_count,
      total_discharge_count: total_discharge_count
    }



    response.list(result_, res)

  } catch (error) {
    response.error(error, res, next)
  }
};



export const dpc_create = async (req, res, next) => {
  try {

    function calculateAge(birthdate) {
      if (!birthdate) {
          throw new Error('Birthdate is required');
      }
  
      const birthDateObj = new Date(birthdate);
      const today = new Date();
      
      // Validate the birthdate
      if (isNaN(birthDateObj.getTime())) {
          throw new Error('Invalid birthdate format');
      }
      
      const yearDifference = today.getFullYear() - birthDateObj.getFullYear();
      const monthDifference = today.getMonth() - birthDateObj.getMonth();
      const dayDifference = today.getDate() - birthDateObj.getDate();
  
      // Calculate age in full years and fractional part
      let age = yearDifference;
      if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
          age--;
      }
  
      // Calculate fractional part
      const totalDaysInYear = 365.25; // Average year length accounting for leap years
      const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
      const daysPastLastBirthday = (today.getMonth() - birthDateObj.getMonth()) * daysInMonth + dayDifference;
  
      const fractionOfYear = daysPastLastBirthday / totalDaysInYear;
  
      return age + fractionOfYear;
  }


    function calculateHospitalizationDays(admissionDate, dischargeDate) {
      const admission = new Date(admissionDate);
      const discharge = new Date(dischargeDate);
      const differenceInTime = discharge.getTime() - admission.getTime();
      const differenceInDays = differenceInTime / (1000 * 3600 * 24);
      return differenceInDays;
    }

    function code_filter(code_arr,first_items,index_start,index_end){   
      let col_sur_1=[]
      
      for (let i=0; i<code_arr.length; i++){
          let item=code_arr[i]
          let item_10=item.substring(index_start, index_end)

          //console.log('item_10=',item_10, ' first_items=',first_items)
          
          if(item_10.toUpperCase()==first_items.toUpperCase()){
              let sur_1=item.substring(index_end, index_end+1)
              col_sur_1.push(sur_1)
          }
      }
      return col_sur_1
    }

    let req_data_all = req.body
 

    for (let x = 0; x < req_data_all.length; x++) {

      let color_obj=[]
      let hospitalization_days = null

      //incomming
      let first_loop_collect = req_data_all[x].first_loop_collect

      let admissionDate = first_loop_collect?.admission_date;
      let dischargeDate = first_loop_collect?.discharge_date;
      let treatmentDate = first_loop_collect?.treatment_date

      let receipt_obj = req_data_all[x].receipt_obj
      let items_obj = req_data_all[x].items_obj
      let amount_obj = req_data_all[x].amount_obj
      let doctor_obj = req_data_all[x].doctor_obj
      let date_obj = req_data_all[x].date_obj
      let dept_obj = req_data_all[x].dept_obj
      let disease_obj = req_data_all[x].disease_obj

      

      let icd = first_loop_collect.icd_code

      let uid_ = first_loop_collect.patient_code.toString() + '' + first_loop_collect?.admission_date.replaceAll("/", "") + '' + first_loop_collect.hospital_id.toString()
      let uid = parseInt(uid_)

      //declar
      let dpc_6 = ""
      let and_1 = "X"
      let age_1 = "X"
      let sur_2 = "99"  
      let tre1_1 = ""
      let tre2_1 = ""
      let sec_1 = ""
      let sco_1 = ""



      //Query + hospitalization_days
      if (admissionDate && dischargeDate) {
        hospitalization_days = calculateHospitalizationDays(admissionDate, dischargeDate).toString()
      } else if (admissionDate && treatmentDate) {
        hospitalization_days = calculateHospitalizationDays(admissionDate, treatmentDate).toString()
      }


      //Query 1 icd -> dpc
      let search = icd
      for (let j = 0; j < icd.length - 1; j++) {
        search = search.slice(0, -1);
        let dpc = await prisma.icd_dpc.findMany({
          where: {
            icd: { contains: search },
          },
        })
        if (dpc.length > 0) {
          dpc_6 = dpc[0].dpc
          j = icd.length - 2
        }
      }

 
      //Query Layer 3
      let temp_tre1_1 = 'X'
      let temp_tre2_1 = 'X'
      let temp_sec_1 = 'X'
      let temp_sco_1 = 'X'
      
      
      ////////////////////////////////////////////////////////////////////////////////////////////////
      for (let m = 0; m < receipt_obj.length; m++) {
        let item_receipt_obj = receipt_obj[m]
        let clr = 'black'

        if (item_receipt_obj) {
          let find_ = await prisma.treatment_1.findMany({
            where: {
              recept_main: item_receipt_obj,
            },
          })

          if (find_.length > 0) {
            //found t1
            temp_tre1_1 = find_[0].corres_code.toString()
            clr = 'Blue'

            //need validate


          } else {
            /* let find_ =  await prisma.treatment_2.findMany({
               where: {
                 recept_main:  item_receipt_obj ,
               },
             })*/

            let itmx = items_obj[m]



            let find_ = null

            if (itmx) {
              find_ = await prisma.treatment_2.findMany({
                where: {
                  AND: [
                    { name: { equals: itmx }, },
                    { recept_main: receipt_obj[m] },
                    { dpc_6digit: dpc_6 }
                  ]

                },
              })
            }

            if (find_?.length > 0) {

              //found t2

              temp_tre2_1 = find_[0].corres_code.toString()
              //if(temp_tre2_1=='5'){
              //console.log(receipt_obj[m],itmx,dpc_6,find_.length)
              //console.log(find_.length,find_[0].recept_main,'=',receipt_obj[m],'/',find_[0].name,'=',items_obj[m])
              // }
              clr = 'Brown'
            } else {

              let itm = items_obj[m]
              if (itm) {
                let find_ = await prisma.secondary_injury.findMany({
                  where: {
                    drug_name: { equals: itm },
                  },
                })
                if (find_.length > 0) {
                  //found t3
                  clr = 'Green'
                  temp_sec_1 = '1'
                } else {

                }
              }
            }
          }
        }

        color_obj.push(clr)
      }
      //////////////////////////////////////////////////////////////////////////////

      //if (temp_tre1_1 == null) {  temp_tre1_1 = 'X'  } if (temp_tre2_1 == null) {  temp_tre2_1 = 'X'  } if (temp_sec_1 == null) {  temp_sec_1 = 'X' }
      //--------------------------------------------------- L.4/5/6




      //check have 99 surgery for that dpc      
      let dpc_disease_classi = await prisma.dpc_disease_classi.findMany({
        where: {
          dpc_6: dpc_6,
        },
        select:{
          and_1:true,
          age_1:true,
          sur_2:true,
          tre1_1:true,
          tre2_1:true,
          sec_1:true,
          sco_1:true,
          codes:true
         }
      })


      if(dpc_disease_classi?.length>0){
        let dpc_disease_classi_first=dpc_disease_classi[0]
        if(dpc_disease_classi_first.sur_2.split(",").includes("99")==true){  }else{   sur_2="XX"  } //
        
        //age hisab

        const age = calculateAge(first_loop_collect?.date_of_birth);

   

        let Arr_and_1 = dpc_disease_classi_first.and_1.split(",")
        let Arr_age_1 = dpc_disease_classi_first.age_1.split(",")

        if(Arr_and_1?.length==1){ //always x
          //default value X
        }else if(Arr_and_1?.length>1){   
           for(let c=0; c<Arr_and_1.length;c++){
             let temp1=Arr_and_1[c]
             if(temp1=='0'){
                //dependency
             }else if(temp1=='1'){
               if (age < 15 ) { and_1 = "1" }
             }else if(temp1=='2'){
               if (age >= 15 && age < 165 ) { and_1 = "2" }
             }
           }
        } 

 
        if(Arr_age_1?.length==1){//always x
         //default value X
        }else if(Arr_age_1?.length>1){  
          
          
          for(let c=0; c<Arr_age_1.length;c++){
              let temp1=Arr_age_1[c]

              if(dpc_6=='010020' || dpc_6=='010040'){
                age_1 = "0"
              }else if(dpc_6=='060160'){

                if(temp1=='1'){  if (age < 15) { age_1 = "1" }    }else if(temp1=='0'){   if (age > 15) { age_1 = "0" }   }
                
              }else if(dpc_6=='180010' || dpc_6=='14031x'){

                if(temp1=='1'){  if (age < 1) { age_1 = "1" }    }else if(temp1=='0'){   if (age > 1) { age_1 = "0" }   }
                
              }else if(dpc_6=='130110'){
              
                if(temp1=='1'){  if (age < 1) { age_1 = "1" }    }else if(temp1=='0'){   if (age > 1) { age_1 = "0" }   }

              }else if(dpc_6=='150070'){
                if(temp1=='1'){  if (age < 2) { age_1 = "1" }    }else if(temp1=='0'){   if (age > 2) { age_1 = "0" }   }
              } else if(dpc_6=='040080'){
 
                if(temp1=='0'){
                    if (age < 1) { age_1 = "0" } 
                }else if(temp1=='1'){
                  if (age >= 1 && age < 15 ) { age_1 = "1" }
                }else if(temp1=='2'){
                  if (age >= 15 && age < 65 ) { age_1 = "2" }
                }else if(temp1=='3'){
                  if (age >= 65 && age < 75 ) { age_1 = "3" }
                }else if(temp1=='4'){
                  if (age >= 75 && age < 150 ) { age_1 = "4" }
                }
              }
          }


        } 

        // temp_tre1_1 = 'X'
        // 
        // temp_tre2_1 = 'X'
        // temp_sec_1 = 'X'

        let code_arr=dpc_disease_classi_first.codes.split(",")
 
        //////////////////////////////////////////////////////////// 
        let col_sur_1 = code_filter(code_arr,dpc_6+''+and_1+''+age_1+''+sur_2,0,10)
        //console.log(dpc_6+'/'+and_1+'/'+age_1+'/'+sur_2)
  
        if(temp_tre1_1=='X'){ //no surgery 1 value
            if(col_sur_1.includes('0')){
              temp_tre1_1='0'
            }else if(col_sur_1.includes('x')){
              temp_tre1_1='X'
            }
        }else{
          //validate
            if(col_sur_1.includes(temp_tre1_1)){
              
            }else{
              if(col_sur_1.includes('0')){
                temp_tre1_1='0'
              }else if(col_sur_1.includes('x')){
                temp_tre1_1='X'
              }
            }
        }

        /////////////////////////////////////////////////////////////
        let col_sur_2 = code_filter(code_arr,dpc_6+and_1+age_1+sur_2+temp_tre1_1,0,11)
         
        if(temp_tre2_1=='X'){ //no surgery 1 value
            if(col_sur_2.includes('0')){
              temp_tre2_1='0'
            }else if(col_sur_2.includes('x')){
              temp_tre2_1='X'
            }
        }else{
          //validate
          if(col_sur_2.includes(temp_tre2_1)){
              
          }else{
            if(col_sur_2.includes('0')){
              temp_tre2_1='0'
            }else if(col_sur_2.includes('x')){
              temp_tre2_1='X'
            }
          }
        }

 
          let col_temp_sec_1 = code_filter(code_arr,dpc_6+and_1+age_1+sur_2+temp_tre1_1+temp_tre2_1,0,12)
          
          if(temp_sec_1=='X'){ //no    1 value
            if(col_temp_sec_1.includes('0')){
              temp_sec_1='0'
            }else if(col_temp_sec_1.includes('x')){
              temp_sec_1='X'
            }
          }else{
            temp_sec_1=col_temp_sec_1[0] || '0'
          }
    
          let col_temp_sco_1 = code_filter(code_arr,dpc_6+and_1+age_1+sur_2+temp_tre1_1+temp_tre2_1+temp_sec_1,0,13)
          
          if(temp_sco_1=='X'){ //no    1 value
            if(col_temp_sco_1.includes('0')){
              temp_sco_1='0'
            }else if(col_temp_sco_1.includes('x')){
              temp_sco_1='X'
            }
          }else{
           
              temp_sco_1=col_temp_sco_1[0] || '0'
        
            //validate
  
            
  
          }
 
      }







      let data = {
        "hospital_id": first_loop_collect.hospital_id,
        "patient_code": first_loop_collect.patient_code,
        "doctor": first_loop_collect.doctor,
        "ward": first_loop_collect.ward,
        "icd_code": first_loop_collect.icd_code,
        "admission_date": first_loop_collect?.admission_date?.toString(),
        "discharge_date": first_loop_collect?.discharge_date?.toString(),
        "treatment_date": first_loop_collect?.treatment_date?.toString(),
        "date_of_birth": first_loop_collect?.date_of_birth?.toString(),


        arr_doctor: JSON.stringify(doctor_obj),
        arr_receipt: JSON.stringify(receipt_obj),
        arr_date: JSON.stringify(date_obj),
        arr_name: JSON.stringify(items_obj),
        arr_amount: JSON.stringify(amount_obj),
        arr_dept: JSON.stringify(dept_obj),
        arr_disease: JSON.stringify(disease_obj),
        arr_color: JSON.stringify(color_obj),


        //system
        "dpc_6": dpc_6,
        "and_1": and_1,
        "age_1": age_1,
        "sur_2": sur_2,
        "tre1_1": temp_tre1_1,
        "tre2_1": temp_tre2_1,
        "sec_1": temp_sec_1,
        "sco_1": temp_sco_1,

        "dpc_code":dpc_6+and_1+age_1+sur_2+temp_tre1_1+temp_tre2_1+temp_sec_1+temp_sco_1, //initial

        //staff
        "s_dpc_6": null,
        "s_and_1": null,
        "s_age_1": null,
        "s_sur_2": null,
        "s_tre1_1": null,
        "s_tre2_1": null,
        "s_sec_1": null,
        "s_sco_1": null,

        "hospitalization_days": hospitalization_days,

        "verified_by": null,
        "verified_at": "",
        "created_by": user_id
      }


      /*---------------------------------------------------------CRUD-----------------------------------------------*/

      //find uid

      //yes? upnade
      // what actually update! dpc code

      const find_ = await prisma.dpc_generate.findUnique({
        where: {
          uid: uid,
        },
        select: {
          id: true,
          dpc_6: true,
          and_1: true,
          age_1: true,
          sur_2: true,
          tre1_1: true,
          tre2_1: true,
          sec_1: true,
          sco_1: true,

          s_dpc_6: true,
          s_and_1: true,
          s_age_1: true,
          s_sur_2: true,
          s_tre1_1: true,
          s_tre2_1: true,
          s_sec_1: true,
          s_sco_1: true,

          arr_doctor: true,
          arr_receipt: true,
          arr_date: true,
          arr_name: true,
          arr_amount: true,
          arr_dept: true,
          arr_disease: true,
          arr_color:true,
        }
      })


      

      //update please
      if (find_) {



        /*Start Analysis previous arrays*/
        //this admission date found?
        //admissionDate
       

        let j_arr_doctor=null
        let j_arr_receipt=null
        let j_arr_date=null
        let j_arr_name=null
        let j_arr_amount=null
        let j_arr_dept=null
        let j_arr_disease=null
        let j_arr_color=null

        try {
          let k_arr_doctor=JSON.parse(find_.arr_doctor)
          let k_arr_receipt=JSON.parse(find_.arr_receipt)
          let k_arr_date=JSON.parse(find_.arr_date)
          let k_arr_name=JSON.parse(find_.arr_name)
          let k_arr_amount=JSON.parse(find_.arr_amount)
          let k_arr_dept=JSON.parse(find_.arr_dept)
          let k_arr_disease=JSON.parse(find_.arr_disease)
          let k_arr_color=JSON.parse(find_.arr_color)
  
          let new_arr_doctor=[]
          let new_arr_receipt=[]
          let new_arr_date=[]
          let new_arr_name=[]
          let new_arr_amount=[]
          let new_arr_dept=[]
          let new_arr_disease=[]
          let new_arr_color=[]
  
  
          {
            k_arr_date.map((date, index) => {
  
              if (date == treatmentDate) {
                //old data not carry
  
              }else{
                new_arr_doctor.push(k_arr_doctor[index])
                new_arr_receipt.push(k_arr_receipt[index])
                new_arr_date.push(date)
                new_arr_name.push(k_arr_name[index])
                new_arr_amount.push(k_arr_amount[index])
                new_arr_dept.push(k_arr_dept[index])
                new_arr_disease.push(k_arr_disease[index])
                new_arr_color.push(k_arr_color[index])
              }
  
            }
            )
          }
  
  
          /*End  Analysis previous arrays*/
   
          //join old and new data
  
  
  
          if(new_arr_doctor?.length>0){
            j_arr_doctor=JSON.stringify(new_arr_doctor).slice(0, -1)+','+JSON.stringify(doctor_obj).slice(1);
            j_arr_receipt=JSON.stringify(new_arr_receipt).slice(0, -1)+','+JSON.stringify(receipt_obj).slice(1);
            j_arr_date=JSON.stringify(new_arr_date).slice(0, -1)+','+JSON.stringify(date_obj).slice(1);
            j_arr_name=JSON.stringify(new_arr_name).slice(0, -1)+','+JSON.stringify(items_obj).slice(1);
            j_arr_amount=JSON.stringify(new_arr_amount).slice(0, -1)+','+JSON.stringify(amount_obj).slice(1);
            j_arr_dept=JSON.stringify(new_arr_dept).slice(0, -1)+','+JSON.stringify(dept_obj).slice(1);
            j_arr_disease=JSON.stringify(new_arr_disease).slice(0, -1)+','+JSON.stringify(disease_obj).slice(1);
            j_arr_color=JSON.stringify(new_arr_color).slice(0, -1)+','+JSON.stringify(color_obj).slice(1);
          }else{
            j_arr_doctor=JSON.stringify(doctor_obj);
            j_arr_receipt=JSON.stringify(receipt_obj);
            j_arr_date=JSON.stringify(date_obj);
            j_arr_name=JSON.stringify(items_obj);
            j_arr_amount=JSON.stringify(amount_obj);
            j_arr_dept=JSON.stringify(dept_obj);
            j_arr_disease=JSON.stringify(disease_obj);
            j_arr_color=JSON.stringify(color_obj);
          }
  
        } catch (error) {
          
        }



        let update_req_data = {

          ...temp_tre1_1 ? { "tre1_1": temp_tre1_1, } : {},
          ...temp_tre2_1 ? { "tre2_1": temp_tre2_1, } : {},
          ...temp_sec_1  ? { "sec_1": temp_sec_1, } : {},

          arr_doctor: j_arr_doctor,
          arr_receipt: j_arr_receipt,
          arr_date: j_arr_date,
          arr_name: j_arr_name,
          arr_amount: j_arr_amount,
          arr_dept: j_arr_dept,
          arr_disease: j_arr_disease,
          arr_color: j_arr_color,

          ...first_loop_collect.discharge_date ? { "discharge_date": first_loop_collect?.discharge_date?.toString(), } : {},
          ...hospitalization_days ? { "hospitalization_days": hospitalization_days, } : {},

        }

        const updateUser = await prisma.dpc_generate.update({
          where: {
            id: find_.id,
          },
          data: update_req_data,
        })
      }

      //create
      else {
        let cre_ = await prisma.dpc_generate.create({
          data: {
            ...data,
            uid: uid,
          },
        })
      }
    }


    response.create([], res)
  } catch (error) {
    response.error(error, res, next)
  }
};




export const dpc_update_code = async (req, res, next) => {
  try {


    function code_filter(code_arr,first_items,index_start,index_end){   
      let col_sur_1=[]
      
      for (let i=0; i<code_arr.length; i++){
          let item=code_arr[i]
          let item_10=item.substring(index_start, index_end)

          //console.log('item_10=',item_10, ' first_items=',first_items)
          
          if(item_10.toUpperCase()==first_items.toUpperCase()){
              let sur_1=item.substring(index_end, index_end+1)
              col_sur_1.push(sur_1)
          }
      }
      return col_sur_1
    }

    function code_filter_sur(code_arr,first_items,index_start,index_end){   
      let col_sur_1=[]
      
      for (let i=0; i<code_arr.length; i++){
          let item=code_arr[i]
          let item_10=item.substring(index_start, index_end)

          //console.log('item_10=',item_10, ' first_items=',first_items)
          
          if(item_10.toUpperCase()==first_items.toUpperCase()){
              let sur_1=item.substring(index_end, index_end+2)
              col_sur_1.push(sur_1)
          }
      }
      return col_sur_1
    }

    let up = 0
    //console.log(req.body)

    /*patient_code:this_['患者コード'],
    k_code:this_['DPC入院情報手術Kコード'],

    treatment_date:this_['DPC入院情報手術日'],
    discharge_date:this_['退院日'],
    admission_date:this_['入院日'],

    arr_disease:this_['算定項目'],
    points:this_['点数・金額'],*/



    let surgery = req.body.data
    let hospital_id=req.body.hospital_id

    for (let x = 0; x < surgery.length; x++) {
      let this_ = surgery[x]



      let temp1 = await prisma.surgery.findMany({
        where: {
          k_code: this_.k_code
        },
      })


      if (temp1.length > 0) {

        //push on dpc_management
        const find_ = await prisma.dpc_generate.findMany({
          where: {
            patient_code: parseInt(this_.patient_code),
            admission_date:this_.admission_date,
            hospital_id:hospital_id,
          },
          select: {
            id: true,
            patient_code:true,

            dpc_6:true,
            and_1:true,
            age_1:true,
            sur_2:true,
            tre1_1:true,
            tre2_1:true,
            sec_1:true,
            sco_1:true,

            dpc_code:true,


            arr_doctor: true,
            arr_receipt: true,
            arr_date: true,
            arr_name: true,
            arr_amount: true,
            arr_dept: true,
            arr_disease: true,
            arr_color:true,
          }
        })

 

       // console.log(find_[0].patient_code)

        if(find_.length>0){
          let k_arr_doctor=JSON.parse(find_[0].arr_doctor)
          let k_arr_receipt=JSON.parse(find_[0].arr_receipt)
          let k_arr_date=JSON.parse(find_[0].arr_date)
          let k_arr_name=JSON.parse(find_[0].arr_name)
          let k_arr_amount=JSON.parse(find_[0].arr_amount)
          let k_arr_dept=JSON.parse(find_[0].arr_dept)
          let k_arr_disease=JSON.parse(find_[0].arr_disease)
          let k_arr_color=JSON.parse(find_[0].arr_color)

          let new_arr_doctor=[]
          let new_arr_receipt=[]
          let new_arr_date=[]
          let new_arr_name=[]
          let new_arr_amount=[]
          let new_arr_dept=[]
          let new_arr_disease=[]
          let new_arr_color=[]

         // console.log(k_arr_doctor)

          if(k_arr_doctor!=null){

            {
              k_arr_date.map((date, index) => {
    
                if ((this_.treatment_date == k_arr_date[index]) && (this_.arr_disease==k_arr_name[index])) {
                  //old data not carry
                //  console.log('existing removed')
    
                }else{
                  new_arr_doctor.push(k_arr_doctor[index])
                  new_arr_receipt.push(k_arr_receipt[index])
                  new_arr_date.push(k_arr_date[index])
                  new_arr_name.push(k_arr_name[index])
                  new_arr_amount.push(k_arr_amount[index])
                  new_arr_dept.push(k_arr_dept[index])
                  new_arr_disease.push(k_arr_disease[index])
                  new_arr_color.push(k_arr_color[index])
                }
    
              })
            }

            new_arr_doctor.push("   ")
            new_arr_receipt.push("   ")
            new_arr_date.push(this_.treatment_date)
            new_arr_name.push(this_.arr_disease)
            new_arr_amount.push(this_.points)
            new_arr_dept.push(" ")
            new_arr_disease.push(" ")
            new_arr_color.push("Purple")       
              
              let update_req_data = {  
                  arr_doctor: JSON.stringify(new_arr_doctor),
                  arr_receipt: JSON.stringify(new_arr_receipt),
                  arr_date: JSON.stringify(new_arr_date),
                  arr_name: JSON.stringify(new_arr_name),
                  arr_amount: JSON.stringify(new_arr_amount),
                  arr_dept: JSON.stringify(new_arr_dept),
                  arr_disease: JSON.stringify(new_arr_disease),
                  arr_color: JSON.stringify(new_arr_color),  
              }
              
              const updateUser = await prisma.dpc_generate.update({
                where: {
                  id: find_[0].id,
                },
                data: update_req_data,
              })            
          }

          let old_sur= find_[0].sur_2

          let dpc_6=find_[0].dpc_6
          let and_1 =find_[0].and_1
          let age_1 = find_[0].age_1
          let sur_2 = temp1[0].code
          let tre1_1 = find_[0].tre1_1
          let tre2_1 =find_[0].tre2_1
          let sec_1 = find_[0].sec_1
          let sco_1 = find_[0].sco_1

          let dpc_disease_classi = await prisma.dpc_disease_classi.findMany({
            where: {
              dpc_6: dpc_6,
            },
            select:{
              and_1:true,
              age_1:true,
              sur_2:true,
              tre1_1:true,
              tre2_1:true,
              sec_1:true,
              sco_1:true,
              codes:true
             }
          })

          //validate
          if(dpc_disease_classi?.length>0){
            let dpc_disease_classi_first=dpc_disease_classi[0]
            let code_arr=dpc_disease_classi_first.codes.split(",")

             let for_sur = code_filter_sur(code_arr,dpc_6+''+and_1+''+age_1,0,8)
              if(for_sur.includes(sur_2)){
                 
              }else {
                console.log('not included',for_sur,sur_2,old_sur)
                sur_2=old_sur
              }

            
            let col_sur_1 = code_filter(code_arr,dpc_6+''+and_1+''+age_1+''+sur_2,0,10)

                if(tre1_1=='X'){ //no surgery 1 value
                  if(col_sur_1.includes('0')){
                    tre1_1='0'
                  }else if(col_sur_1.includes('x')){
                    tre1_1='X'
                  }
                }else{
                  //validate
                    if(col_sur_1.includes(tre1_1)){
                      
                    }else{
                      if(col_sur_1.includes('0')){
                        tre1_1='0'
                      }else if(col_sur_1.includes('x')){
                        tre1_1='X'
                      }
                    }
                }



                let col_sur_2 = code_filter(code_arr,dpc_6+and_1+age_1+sur_2+tre1_1,0,11)
         
                if(tre2_1=='X'){ //no surgery 1 value
                    if(col_sur_2.includes('0')){
                      tre2_1='0'
                    }else if(col_sur_2.includes('x')){
                      tre2_1='X'
                    }
                }else{
                  //validate
                  if(col_sur_2.includes(tre2_1)){
                      
                  }else{
                    if(col_sur_2.includes('0')){
                      tre2_1='0'
                    }else if(col_sur_2.includes('x')){
                      tre2_1='X'
                    }
                  }
                }
        
         
                  let col_sec_1 = code_filter(code_arr,dpc_6+and_1+age_1+sur_2+tre1_1+tre2_1,0,12)
                  
                  if(sec_1=='X'){ //no    1 value
                    if(col_sec_1.includes('0')){
                      sec_1='0'
                    }else if(col_sec_1.includes('x')){
                      sec_1='X'
                    }
                  }else{
                    sec_1=col_sec_1[0] || '0'
                  }
            
                  let col_sco_1 = code_filter(code_arr,dpc_6+and_1+age_1+sur_2+tre1_1+tre2_1+sec_1,0,13)
                  
                  if(sco_1=='X'){ //no    1 value
                    if(col_sco_1.includes('0')){
                      sco_1='0'
                    }else if(col_sco_1.includes('x')){
                      sco_1='X'
                    }
                  }else{                  
                      sco_1=col_sco_1[0] || '0'
                    //validate
                  }
          }


              let new_dpc_code =find_[0].dpc_code.substring(0,8)+sur_2+tre1_1+tre2_1+sec_1+sco_1

              console.log(find_[0].dpc_code)
              console.log(new_dpc_code)
              console.log('----------------')

                up++
                let temp2 = await prisma.dpc_generate.updateMany({
                  where: {
                    patient_code: this_.patient_code,
                    admission_date:this_.admission_date,
                    hospital_id:hospital_id,
                  },
                  data: {
                    sur_2: sur_2,
                    tre1_1:tre1_1,
                    tre2_1:tre2_1,
                    sec_1:sec_1,
                    sco_1:sco_1,
                  },
                })

        }
 



        //console.log(temp2,'temp2',this_.patient_code)
      }
    }

    //console.log('up',up)
    response.update([], res)
  } catch (error) {
    response.error(error, res, next)
  }
};



export const dpc_migrate = async (req, res, next) => {
  try {
    //console.log(req.body['key'])

    String.prototype.replaceAt = function(index, replacement) {
      return this.substring(0, index) + replacement + this.substring(index + replacement.length);
  }
  


    let mig = await prisma.dpc_generate.findMany({
      select: { 
        "id":true,
        "dpc_6": true,
        "sur_2": true,
        dpc_code: true,
      }
    })

    for(let i=0; i<mig.length;i++){
      let th=mig[i]
      
      let dpc_disease_classi = await prisma.dpc_disease_classi.findMany({
        where: {
          dpc_6: th.dpc_6,
        },
        select:{
          sur_2:true
        }
      })

      if(dpc_disease_classi?.length>0){
        if(dpc_disease_classi[0].sur_2.split(",").includes("99")==true){
          console.log('true')
        }else{
           

          var hello =th.dpc_code;
          let kk=hello.replaceAt(8, "X");
          kk=kk.replaceAt(9, "X");

          console.log({sur_2:"XX",dpc_code:kk})

            const update = await prisma.dpc_generate.update({
              where: { id:th.id },
              data: {sur_2:"XX",dpc_code:kk},
            });
        }
      }
    }






    //migration
    /*let mig = await prisma.dpc_generate.findMany({
      select: { 
        "id":true,
        "dpc_6": true,
        "and_1": true,
        "age_1": true,
        "sur_2": true,
        "tre1_1": true,
        "tre2_1": true,
        "sec_1": true,
        "sco_1": true,

        "s_dpc_6": true,
        "s_and_1": true,
        "s_age_1": true,
        "s_sur_2": true,
        "s_tre1_1": true,
        "s_tre2_1": true,
        "s_sec_1": true,
        "s_sco_1": true,
      }
    })

    for(let i=0; i<mig.length;i++){
      let th=mig[i]
      let new_code=th.dpc_6+th.and_1+th.age_1+th.sur_2+th.tre1_1+th.tre2_1+th.sec_1+th.sco_1

      const update = await prisma.dpc_generate.update({
        where: { id:th.id },
        data: {dpc_code:new_code},
      });
    }*/
    response.update([], res)
  } catch (error) {
    response.error(error, res, next)
  }
};


export const dpc_update = async (req, res, next) => {
  try {
    //console.log(req.body['key'])

    //migration
   /* let mig = await prisma.dpc_generate.findMany({
      select: { 
        "id":true,
        "dpc_6": true,
        "and_1": true,
        "age_1": true,
        "sur_2": true,
        "tre1_1": true,
        "tre2_1": true,
        "sec_1": true,
        "sco_1": true,

        "s_dpc_6": true,
        "s_and_1": true,
        "s_age_1": true,
        "s_sur_2": true,
        "s_tre1_1": true,
        "s_tre2_1": true,
        "s_sec_1": true,
        "s_sco_1": true,
      }
    })

    for(let i=0; i<mig.length;i++){
      let th=mig[i]
      let new_code=th.dpc_6+th.and_1+th.age_1+th.sur_2+th.tre1_1+th.tre2_1+th.sec_1+th.sco_1

      const update = await prisma.dpc_generate.update({
        where: { id:th.id },
        data: {dpc_code:new_code},
      });
    }*/


    let temp1 = await prisma.dpc_generate.findMany({
      where: { id: req.body.id },
      select: { dpc_code:true}
    })

    let str=temp1[0].dpc_code
    let x_dpc_6  =str.substring(0, 6);
    let x_and_1  =str.substring(6, 7);
    let x_age_1  =str.substring(7, 8);
    let x_sur_2  =str.substring(8, 10);
    let x_tre1_1 =str.substring(10, 11);
    let x_tre2_1 =str.substring(11, 12);
    let x_sec_1  =str.substring(12, 13);
    let x_sco_1  =str.substring(13, 14);

    



    let data = null
    if (req.body['key'] == 'dpc_6') { data = { s_dpc_6: req.body.value }; x_dpc_6=req.body.value; }
    if (req.body['key'] == 'and_1') { data = { s_and_1: req.body.value }; x_and_1=req.body.value; }
    if (req.body['key'] == 'age_1') { data = { s_age_1: req.body.value }; x_age_1=req.body.value;  }
    if (req.body['key'] == 'sur_2') { data = { s_sur_2: req.body.value }; x_sur_2=req.body.value;  }
    if (req.body['key'] == 'tre1_1') { data = { s_tre1_1: req.body.value }; x_tre1_1=req.body.value;  }
    if (req.body['key'] == 'tre2_1') { data = { s_tre2_1: req.body.value }; x_tre2_1=req.body.value;  }
    if (req.body['key'] == 'sec_1') { data = { s_sec_1: req.body.value }; x_sec_1=req.body.value;  }
    if (req.body['key'] == 'sco_1') { data = { s_sco_1: req.body.value }; x_sco_1=req.body.value;  }

    const update = await prisma.dpc_generate.update({
      where: { id: req.body.id },
      data: {...data,dpc_code:x_dpc_6+x_and_1+x_age_1+x_sur_2+x_tre1_1+x_tre2_1+x_sec_1+x_sco_1},
    });

    response.update([], res)
  } catch (error) {
    response.error(error, res, next)
  }
};



export const dpc_verify = async (req, res, next) => {
  try {
    //console.log(req.body)
    const update = await prisma.dpc_generate.update({
      where: { id: req.body.id }, // specify the unique identifier of the record to update
      data: {
        is_verified: req.body.is_verified, // specify the fields to update
      },
    });

    response.update(update, res)
  } catch (error) {
    response.error(error, res, next)
  }
};


export const dpc_list = async (req, res, next) => {
  try {

    let filter = req.body?.filter
    let is_verified = req.body?.is_verified

    

    var range_start=req.body.filter.range_start
    var range_end=req.body.filter.range_end
    var date_type=req.body.filter.date_type
    var patient_code=req.body.filter.patient_code
    var hospitalization_days=req.body.filter.hospitalized_days
    var dpcPattern=req.body.filter.dpcPattern
    var typeDisPatient=req.body.filter.typeDisPatient



    let d1=timeStable(created_at()) || null
    let d2=timeStable(created_at(hospitalization_days)) || null
     
    //console.log('x',d2)

    let dpc_6 = null
    let and_1 = null
    let age_1 = null
    let sur_2 = null  
    let tre1_1 = null
    let tre2_1 = null
    let sec_1 = null
    let sco_1 = null


   
    try {
       const myArray = dpcPattern.split(" ");
      if(myArray[0]!='XXXXXX'){ dpc_6 = myArray[0]}else{}
      if(myArray[1]!='X'){ and_1 = myArray[1]}else{}
      if(myArray[2]!='X'){ age_1 = myArray[2]}else{}
      if(myArray[3]!='XX'){ sur_2 = myArray[3]}else{}
      if(myArray[4]!='X'){ tre1_1 = myArray[4]}else{}
      if(myArray[5]!='X'){ tre2_1 = myArray[5]}else{}
      if(myArray[6]!='X'){ sec_1 = myArray[6]}else{}
      if(myArray[7]!='X'){ sco_1 = myArray[7]}else{}

    } catch (error) {
      
    }

    let result_ = await prisma.dpc_generate.findMany({
      ...response.list_paginate(req),
      where: {
        //patient_code:300366,
        ...dpc_6? { OR:[{dpc_6: dpc_6 },{s_dpc_6: dpc_6}]}   : {},
        ...and_1? { OR:[{and_1: and_1 },{s_and_1: and_1}]}   : {},
        ...age_1? { OR:[{age_1: age_1 },{s_age_1: age_1}]}   : {},
        ...sur_2? { OR:[{sur_2: sur_2},{s_sur_2: sur_2}] }   : {},
        ...tre1_1?{ OR:[{tre1_1: tre1_1 },{s_tre1_1: tre1_1}]}   : {},
        ...tre2_1?{ OR:[{tre2_1: tre2_1 },{s_tre2_1: tre2_1 }]}  : {},
        ...sec_1? { OR:[{sec_1: sec_1 },{s_sec_1: sec_1}]}   : {},
        ...sco_1? { OR:[{sco_1: sco_1 },{s_sco_1: sco_1}]}   : {},

        ...date_type=='admission_date'?{ admission_date: { ...(range_end ? { lte: range_end } : {}),  ...(range_start ? { gte: range_start } : {}),},}:{},
        ...date_type=='discharge_date'?{ discharge_date: { ...(range_end ? { lte: range_end } : {}),  ...(range_start ? { gte: range_start } : {}),},}:{},
        ...date_type=='date_of_birth'?{ date_of_birth: { ...(range_end ? { lte: range_end } : {}),  ...(range_start ? { gte: range_start } : {}),},}:{},
        ...patient_code? { patient_code: parseInt(patient_code) } : {},

        ...typeDisPatient=='all-active-patient'? { discharge_date: null } : {},
        ...typeDisPatient=='dis-patient'? { discharge_date:  {
          not: null,
        }, } : {},




           ...hospitalization_days>-1? { 
              admission_date:d2,
              discharge_date: null,
           } : {},



        hospital_id: req.body?.hospital_id,
        ...is_verified == 1 ? { is_verified: 1 } : {},
        ...is_verified == 0 ? { is_verified: 0 } : {},
      },
      select: {
        id: true,
        "hospital_id": true,
        "patient_code": true,
        "doctor": true,
        "receipt_obj": true,
        "items_obj": true,
        "amount_obj": true,
        "ward": true,
        "icd_code": true,
        "admission_date": true,
        "discharge_date": true,
        "treatment_date": true,
        "date_of_birth": true,

        "dpc_6": true,
        "and_1": true,
        "age_1": true,
        "sur_2": true,
        "tre1_1": true,
        "tre2_1": true,
        "sec_1": true,
        "sco_1": true,

        "s_dpc_6": true,
        "s_and_1": true,
        "s_age_1": true,
        "s_sur_2": true,
        "s_tre1_1": true,
        "s_tre2_1": true,
        "s_sec_1": true,
        "s_sco_1": true,

        "dpc_code":true,


        "hospitalization_days": true,

        "is_verified": true,
        "verified_by": true,
        "verified_at": true,
        "created_by": true,

        arr_doctor: true,
        arr_receipt: true,
        arr_date: true,
        arr_name: true,
        arr_amount: true,
        arr_dept: true,
        arr_disease: true,
        arr_color: true,

        dpc_disease_classi:true,
        dpc_disease_classi2:true,

      }
    })


   // console.log(JSON.stringify(result_[0].dpc_disease_classi))

    const groupBy = await prisma.dpc_generate.groupBy({
      by: ['is_verified'],
      _count: {
        is_verified: true,
      },
      where: {

        ...dpc_6? { dpc_6: dpc_6 } : {},
        ...and_1? { and_1: and_1 } : {},
        ...age_1? { age_1: age_1 } : {},
        ...sur_2? { sur_2: sur_2 } : {},
        ...tre1_1? { tre1_1: tre1_1 } : {},
        ...tre2_1? { tre2_1: tre2_1 } : {},
        ...sec_1? { sec_1: sec_1 } : {},
        ...sco_1? { sco_1: sco_1 } : {},

        hospital_id: req.body?.hospital_id,
        ...date_type=='admission_date'?{ admission_date: { ...(range_end ? { lte: range_end } : {}),  ...(range_start ? { gte: range_start } : {}),},}:{},
        ...date_type=='discharge_date'?{ discharge_date: { ...(range_end ? { lte: range_end } : {}),  ...(range_start ? { gte: range_start } : {}),},}:{},
        ...date_type=='date_of_birth'?{ date_of_birth: { ...(range_end ? { lte: range_end } : {}),  ...(range_start ? { gte: range_start } : {}),},}:{},
        ...patient_code? { patient_code: parseInt(patient_code) } : {},


        ...typeDisPatient=='all-active-patient'? { discharge_date: null } : {},
        ...typeDisPatient=='dis-patient'? { discharge_date:  {
          not: null,
        }, } : {},

        ...hospitalization_days>-1? { 
          admission_date: d2,
          discharge_date: null,
       } : {},


      }
    })

 
 
    response.list({ list: result_, count: groupBy }, res)
  } catch (error) {
    response.error(error, res, next)
  }
};





export const image = async (req, res, next) => {
  let image = req.params.image
  res.sendFile(path.join(__dirname.replace("\controllers", "") + "./uploads/" + image));
};


export const manage_logo = async (req, res, next) => {

  const uploadDir = path.join(__dirname.replace("\controllers", "") + '/uploads');

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, '0777', true);
  const customOptions = { uploadDir: uploadDir, keepExtensions: true, allowEmptyFiles: false, maxFileSize: 5 * 1024 * 1024 * 1024, multiples: true };
  const form = new IncomingForm(customOptions);
  // console.log(form)
  let file_count = req.query.counts

  let id = parseInt(req.query.id)

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
       // console.log(error, 'error')
      }


      //console.log(file.name,'file-'+x.toString())
    }
    res.status(200).json({});
  });
};

export const manage_update = async (req, res, next) => {
  try {
    let clock = created_at()

    //admin update
    let name = req.body.admin_name
    let email = req.body.admin_email
    let phone = req.body.admin_phone

    let password = null
    if (req.body.admin_password) {
      password = req.body.admin_password
    }

    //hospital update
    let id = req.body.id
    let h_name = req.body.name
    let h_address = req.body.address
    let updated_at = clock
    let updated_by = user_id


    const filterhospitals = await prisma.hospitals.findMany({
      where: {
        id: id,
      },
    });


    const update1 = await prisma.admins.updateMany({
      where: {
        id: filterhospitals[0].admin_id,
      },
      data: {
        name: name,
        email: email,
        phone: phone,
        ...password ? { password: md5(password) } : {},
      },
    });

    const update2 = await prisma.hospitals.updateMany({
      where: {
        id: id,
      },
      data: {
        name: h_name,
        address: h_address,
        updated_at: updated_at,
        updated_by: updated_by,
      },
    });


    response.list([], res)
  } catch (error) {
    response.error(error, res, next)
  }
};


export const manage_remove = async (req, res, next) => {
  try {
    let admin_email = req.body.admin_email
    //remove admin
    let delete_first = await prisma.hospitals.delete({
      where: {
        id: req.body.id
      },
    })


    //if success remove hospital
    let delete_ = null
    if (delete_first) {
      let delete_ = await prisma.admins.delete({
        where: {
          email: admin_email
        },
      })

      if (delete_) { } else {
        //create again
        const newCreate = await prisma.user.create({
          data: {
            ...delete_first
          },
        });
      }
    } else {


    }

    response.remove(delete_, res)
  } catch (error) {
    response.error(error, res, next)
  }
};



export const dpc_measure = async (req, res, next) => {
  try {

    let dpc_code=req.body.dpc_code
 
    let res1=0
    let res2=0
    let res3=0

    res1 = await prisma.dpc_generate.aggregate({
      where: {
        dpc_code: dpc_code,
        hospital_id:req.body.hospital_id
      },
      _count: {
        id: true,
      },
    })

    let error=0

    res3 = await prisma.days_score.findMany({
      where: {
        receipt: dpc_code,
      },
    })
 

    if(res3.length==0){error=1}

    let result={res1:res1._count.id,res2:0,res3:res3[0]?.period_2 || '',error:error }

    //console.log(dpc_code,'dpc_code',res3.length)

    response.list(result, res)
  } catch (error) {
    response.error(error, res, next)
  }
};