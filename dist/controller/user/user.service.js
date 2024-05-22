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
exports.checkUserIdExists = exports.insertUpdatedUserInfo = exports.insertUserInfo = void 0;
const prisma_1 = require("../../prisma");
const insertUserInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, firstName, lastName, assignedDivision, assignedPosition, assignedSection, dateStarted, jobStatus, password, accountRole, contactNumber, imageUrl, birthDate, middleName, employeeId } = data;
        yield prisma_1.db.userInfo.create({
            data: {
                employeeId,
                email,
                firstName,
                lastName,
                assignedPosition,
                assignedDivision,
                assignedSection,
                dateStarted,
                jobStatus,
                contactNumber,
                imageUrl,
                birthDate,
                middleName,
                account: {
                    create: {
                        email,
                        password,
                        accountRole: accountRole,
                    },
                },
            },
        });
    }
    catch (error) {
        console.log(error);
        throw new Error("Something went wrong while creating user - service!");
    }
});
exports.insertUserInfo = insertUserInfo;
const insertUpdatedUserInfo = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield prisma_1.db.userInfo.update({
            where: {
                id: data.id
            },
            data: {
                email: data.email,
                firstName: data.firstName,
                lastName: data.lastName,
                assignedDivision: data.assignedDivision,
                assignedPosition: data.assignedPosition,
                assignedSection: data.assignedSection,
                dateStarted: data.dateStarted,
                jobStatus: data.jobStatus,
                contactNumber: data.contactNumber,
            }
        });
        return "User updated successfully";
    }
    catch (error) {
        throw new Error("Something went wrong while updating user - service!");
    }
});
exports.insertUpdatedUserInfo = insertUpdatedUserInfo;
const checkUserIdExists = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const isExist = yield prisma_1.db.userInfo.findUnique({
            where: {
                id,
            },
        });
        if (isExist) {
            return true;
        }
        return false;
    }
    catch (error) {
        throw new Error("Something went wrong while checking user id - service!");
    }
});
exports.checkUserIdExists = checkUserIdExists;
