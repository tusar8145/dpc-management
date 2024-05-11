import express from "express";
import * as response from '../helpers/Response.js';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const create = async (req, res, next) => {
    try {
        let table_name=req.params.table
        const result = await prisma[`${table_name}`].createMany({
            data: req.body,
            skipDuplicates: true,
        }) 
  
        response.create(result,res)

    } catch (error) {
        response.error(error,res,next)
    }
}
 

export const update =  async (req, res, next) => {
    try {   
        let table_name=req.params.table
        let receipt = req.body.receipt
        let data = req.body
        Reflect.deleteProperty(data, 'receipt');  
 
        const createMany = await prisma[`${table_name}`].update({
            where: {
                receipt:  parseInt(receipt)   
            },
            data: {...data},
        })

        response.update(createMany,res)

    }catch(error){
        response.error(error,res,next)
    }
}; 

export const list =  async (req, res, next) => {
    try {   
     
        const ignore = req.ignore || [];
        let where_con=req.where_con
        let table_name=null

        if(req.return==true){
             table_name=req.table   
        }else{
             table_name=req.params.table  
        }


        let f_columnFilters = req.body?.filter?.f_columnFilters
        let globalFilter = req.body?.filter?.globalFilter
        let f_globalFilters = req.body?.filter?.f_globalFilters

        const findMany = await prisma[`${table_name}`].findMany({
            ...response.list_paginate(req),
            where: {
                ...req.return == true ? { ...where_con } : {},
                ...f_columnFilters ? { ...f_columnFilters } : {},
                ...globalFilter ?{...f_globalFilters} : {}
            },
        })


        if(req.return==true){
            return findMany;
        }else{
            response.list(findMany,res)
        }

        
    }catch(error){
        response.error(error,res,next)
    }
}; 


 

export const count =  async (req, res, next) => {
    try {   
        let table_name=req.params.table
        
        
        let f_columnFilters = req.body?.filter?.f_columnFilters
        let globalFilter = req.body?.filter?.globalFilter
        let f_globalFilters = req.body?.filter?.f_globalFilters
 


        const count = await prisma[`${table_name}`].aggregate({
            where: {
                ...req.return == true ? { ...where_con } : {},
                ...f_columnFilters ? { ...f_columnFilters } : {},
                ...globalFilter ?{...f_globalFilters} : {}
            },
            _count: {
              id: true,
            },
          })

 

        response.count(count,res)

    }catch(error){
        response.error(error,res,next)
    }
}; 

   
export const remove =  async (req, res, next) => {
    try {   
        let table_name=req.params.table
        const delete_ = await prisma[`${table_name}`].delete({
            where: {
                "id":parseInt(req.body.id)
            },
          })
        
        response.remove(delete_,res)


    }catch(error){
        response.error(error,res,next)
    }
}; 

export const remove_all =  async (req, res, next) => {
    try {   
        let table_name=req.params.table
        const delete_ = await prisma[`${table_name}`].deleteMany({})
        
        response.remove(delete_,res)

    }catch(error){
        response.error(error,res,next)
    }
}; 