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
exports.removePdf = void 0;
const prisma_1 = require("../prisma");
const removePdf = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield prisma_1.db.completeStaffWork.findMany();
        for (const csw of data) {
            const filteredAttachments = csw.attachments.filter((path) => !/\.pdf/.test(path));
            yield prisma_1.db.completeStaffWork.update({
                where: { id: csw.id }, // Use your unique identifier
                data: {
                    attachments: filteredAttachments, // Set the filtered attachments
                },
            });
        }
        res.status(200).json();
    }
    catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
});
exports.removePdf = removePdf;
