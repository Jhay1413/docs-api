"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zodValidation_1 = require("../../middleware/zodValidation");
const company_schema_1 = require("./company.schema");
const company_controller_1 = require("./company.controller");
const router = express_1.default.Router();
router.post('/', (0, zodValidation_1.validateData)(company_schema_1.companyFormData), company_controller_1.createCompanyHandler);
router.get('/', company_controller_1.getCompaniesHandler);
router.get('/:id', company_controller_1.getCompanyHandler);
router.get('/:id/details', company_controller_1.getCompanyDetailsHandler);
router.delete('/:id', company_controller_1.deleteCompanyHandler);
router.put('/:id', company_controller_1.updateCompanyDetailsHandler);
exports.default = router;
