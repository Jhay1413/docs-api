import express from "express";
import { validateData } from "../../middleware/zodValidation";
import { companyFormData } from "./company.schema";
import { createCompanyHandler, deleteCompanyHandler, getCompaniesHandler, getCompanyDetailsHandler, getCompanyHandler, updateCompanyDetailsHandler } from "./company.controller";


const router = express.Router();

router.post('/',validateData(companyFormData),createCompanyHandler)
router.get('/',getCompaniesHandler)
router.get('/:id',getCompanyHandler)
router.get('/:id/details',getCompanyDetailsHandler)
router.delete('/:id',deleteCompanyHandler)
router.put('/:id',updateCompanyDetailsHandler)

export default router;