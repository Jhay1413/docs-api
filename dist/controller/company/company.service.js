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
exports.getCompanyRelationsById = exports.getCompaniesRelations = exports.getCompanyById = exports.getCompanies = exports.insertCompany = exports.deleteCompany = void 0;
const prisma_1 = require("../../prisma");
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.delete({
            where: {
                id,
            },
        });
        return response;
    }
    catch (error) {
        throw new Error("Error while deleting company");
    }
});
exports.deleteCompany = deleteCompany;
const insertCompany = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.create({
            data: {
                companyName: data.companyName,
                companyAddress: data.companyAddress,
                companyId: data.companyId,
                companyProjects: {
                    create: data.companyProjects.map((project) => ({
                        projectName: project.projectName,
                        projectAddress: project.projectAddress,
                        retainer: project.retainer,
                        date_expiry: project.date_expiry || null,
                        contactPersons: {
                            create: {
                                name: project.contactPersons.name,
                                contactNumber: project.contactPersons.contactNumber,
                            },
                        },
                    })),
                },
                contactPersons: {
                    create: {
                        name: data.contactPersons.name,
                        contactNumber: data.contactPersons.contactNumber,
                    },
                },
            },
        });
        console.log(response);
        return response;
    }
    catch (error) {
        console.log(error);
        throw new Error("Error while inserting company");
    }
});
exports.insertCompany = insertCompany;
const getCompanies = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.findMany({
            include: {
                companyProjects: {
                    include: {
                        contactPersons: true
                    }
                },
                contactPersons: true
            }
        });
        return response;
    }
    catch (error) {
        throw new Error("Error while getting companies");
    }
});
exports.getCompanies = getCompanies;
const getCompanyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.findUnique({
            where: {
                id,
            },
        });
        return response;
    }
    catch (error) {
        throw new Error("Error while getting company");
    }
});
exports.getCompanyById = getCompanyById;
const getCompaniesRelations = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.findMany({
            select: {
                companyProjects: true,
                contactPersons: true,
            },
        });
        return response;
    }
    catch (error) {
        throw new Error("Error while getting company relations");
    }
});
exports.getCompaniesRelations = getCompaniesRelations;
const getCompanyRelationsById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.findUnique({
            where: {
                id,
            },
            select: {
                companyProjects: true,
                contactPersons: true,
            },
        });
        return response;
    }
    catch (error) {
        throw new Error("Error while getting company relations");
    }
});
exports.getCompanyRelationsById = getCompanyRelationsById;
