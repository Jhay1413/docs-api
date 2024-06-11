"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompanyDetailsHandler = exports.getCompanyHandler = exports.getCompaniesHandler = exports.createCompanyHandler = exports.deleteCompanyHandler = void 0;
const company_service_1 = require("./company.service");
const deleteCompanyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield (0, company_service_1.deleteCompany)(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.deleteCompanyHandler = deleteCompanyHandler;
const createCompanyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    try {
        const result = yield (0, company_service_1.insertCompany)(data);
        return res.status(201).json(result);
    }
    catch (error) {
        console.log(error);
        return res.status(500).json(error);
    }
});
exports.createCompanyHandler = createCompanyHandler;
const getCompaniesHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield (0, company_service_1.getCompanies)();
        res.status(200).json(result);
    }
    catch (error) {
        return res.status(500).json(error);
    }
});
exports.getCompaniesHandler = getCompaniesHandler;
const getCompanyHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const result = yield (0, company_service_1.getCompanyById)(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getCompanyHandler = getCompanyHandler;
const getCompanyDetailsHandler = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        const result = yield (0, company_service_1.getCompanyRelationsById)(id);
        res.status(200).json(result);
    }
    catch (error) {
        res.status(500).json(error);
    }
});
exports.getCompanyDetailsHandler = getCompanyDetailsHandler;
