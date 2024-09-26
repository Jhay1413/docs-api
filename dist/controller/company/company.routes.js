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
exports.registerCompanyRoutes = void 0;
const express_1 = require("@ts-rest/express");
const shared_contract_1 = require("shared-contract");
const company_service_1 = require("./company.service");
const __1 = require("../..");
const companyRouters = __1.s.router(shared_contract_1.companyContract, {
    insertCompany: (_a) => __awaiter(void 0, [_a], void 0, function* ({ body }) {
        try {
            const result = yield (0, company_service_1.insertCompany)(body);
            return {
                status: 201,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrong ",
                },
            };
        }
    }),
    fetchCompanies: () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const result = yield (0, company_service_1.getCompanies)();
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrwong",
                },
            };
        }
    }),
    fetchCompany: (_b) => __awaiter(void 0, [_b], void 0, function* ({ params: { id } }) {
        try {
            const result = yield (0, company_service_1.getCompanyById)(id);
            return {
                status: 200,
                body: result,
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrwong",
                },
            };
        }
    }),
    deleteCompanyById: (_c) => __awaiter(void 0, [_c], void 0, function* ({ body }) {
        try {
            const result = yield (0, company_service_1.deleteCompany)(body.id);
            return {
                status: 200,
                body: {
                    id: result
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrwong",
                },
            };
        }
    }),
    editCompanyById: (_d) => __awaiter(void 0, [_d], void 0, function* ({ body, params: { id } }) {
        try {
            const result = yield (0, company_service_1.updateCompany)(id, body);
            return {
                status: 200,
                body: {
                    id: result
                },
            };
        }
        catch (error) {
            return {
                status: 500,
                body: {
                    error: "something went wrwong",
                },
            };
        }
    })
});
const registerCompanyRoutes = (app) => {
    (0, express_1.createExpressEndpoints)(shared_contract_1.companyContract, companyRouters, app);
};
exports.registerCompanyRoutes = registerCompanyRoutes;
