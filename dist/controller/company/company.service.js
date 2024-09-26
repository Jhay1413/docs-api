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
exports.getCompanyRelationsById = exports.getCompaniesRelations = exports.getCompanyById = exports.getCompanies = exports.insertCompany = exports.deleteCompany = exports.updateCompany = void 0;
const prisma_1 = require("../../prisma");
const updateCompany = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.update({
            where: {
                id: id,
            },
            data: {
                companyName: data.companyName,
                companyAddress: data.companyAddress,
                companyId: data.companyId,
                companyProjects: {
                    upsert: data.companyProjects.map((project) => ({
                        where: {
                            projectId: project.projectId,
                        },
                        create: {
                            projectId: project.projectId,
                            projectName: project.projectName,
                            projectAddress: project.projectAddress,
                            email: project.email,
                            retainer: project.retainer,
                            date_expiry: project.date_expiry || null,
                            contactPersons: {
                                create: {
                                    name: project.contactPersons.name,
                                    contactNumber: project.contactPersons.contactNumber,
                                    email: project.contactPersons.email,
                                },
                            },
                        },
                        update: {
                            projectId: project.projectId,
                            projectName: project.projectName,
                            projectAddress: project.projectAddress,
                            email: project.email,
                            retainer: project.retainer,
                            date_expiry: project.date_expiry || null,
                            contactPersons: {
                                upsert: {
                                    where: {
                                        id: data.contactPersons.id,
                                    },
                                    update: {
                                        name: data.contactPersons.name,
                                        contactNumber: data.contactPersons.contactNumber,
                                    },
                                    create: {
                                        name: data.contactPersons.name,
                                        contactNumber: data.contactPersons.contactNumber,
                                    },
                                },
                            }
                        }
                    })),
                },
                contactPersons: {
                    upsert: {
                        where: {
                            id: data.contactPersons.id,
                        },
                        update: {
                            name: data.contactPersons.name,
                            contactNumber: data.contactPersons.contactNumber,
                        },
                        create: {
                            name: data.contactPersons.name,
                            contactNumber: data.contactPersons.contactNumber,
                        },
                    },
                },
            },
        });
        return response;
    }
    catch (error) {
        console.log(error);
        throw new Error("Something went wrong while updating company");
    }
});
exports.updateCompany = updateCompany;
const deleteCompany = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield prisma_1.db.company.delete({
            where: {
                id,
            },
        });
        return response.id;
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
                email: data.email,
                companyProjects: {
                    create: data.companyProjects.map((project) => ({
                        projectId: project.projectId,
                        projectName: project.projectName,
                        projectAddress: project.projectAddress,
                        retainer: project.retainer,
                        email: project.email,
                        date_expiry: project.date_expiry || null,
                        contactPersons: {
                            create: {
                                name: project.contactPersons.name,
                                contactNumber: project.contactPersons.contactNumber,
                                email: project.contactPersons.email,
                            },
                        },
                    })),
                },
                contactPersons: {
                    create: {
                        name: data.contactPersons.name,
                        contactNumber: data.contactPersons.contactNumber,
                        email: data.contactPersons.email,
                    },
                },
            },
        });
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
            include: { companyProjects: true },
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
            include: {
                companyProjects: {
                    include: {
                        contactPersons: true,
                    },
                },
                contactPersons: true,
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
