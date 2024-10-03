"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.companyContract = void 0;
const core_1 = require("@ts-rest/core");
const company_schema_1 = require("./company.schema");
const zod_1 = require("zod");
const companiesContract = (0, core_1.initContract)();
exports.companyContract = companiesContract.router({
    insertCompany: {
        method: "POST",
        path: "/companies",
        responses: {
            201: company_schema_1.companyFormData,
            500: zod_1.z.object({
                error: zod_1.z.string(),
            }),
        },
        body: company_schema_1.companyFormData,
    },
    fetchCompanies: {
        method: "GET",
        path: "/companies",
        responses: {
            200: zod_1.z.array(company_schema_1.companyFormData).nullable(),
            500: zod_1.z.object({
                error: zod_1.z.string(),
            }),
        },
    },
    fetchCompany: {
        method: "GET",
        path: "/company/:id",
        pathParams: zod_1.z.object({
            id: zod_1.z.string(),
        }),
        responses: {
            200: company_schema_1.companyFormData.nullable(),
            500: zod_1.z.object({
                error: zod_1.z.string(),
            }),
        },
    },
    deleteCompanyById: {
        method: "DELETE",
        path: "/company/",
        body: zod_1.z.object({
            id: zod_1.z.string()
        }),
        responses: {
            200: zod_1.z.object({
                id: zod_1.z.string(),
            }),
            500: zod_1.z.object({
                error: zod_1.z.string(),
            }),
        },
    },
    editCompanyById: {
        method: "PUT",
        path: "/company/:id",
        pathParams: zod_1.z.object({
            id: zod_1.z.string()
        }),
        body: company_schema_1.companyFormData,
        responses: {
            201: company_schema_1.companyFormData,
            500: zod_1.z.object({
                error: zod_1.z.string(),
            }),
        }
    }
});
