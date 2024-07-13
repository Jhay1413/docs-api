"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateId = void 0;
const GenerateId = (lastId) => {
    const year = new Date().getFullYear();
    if (!lastId) {
        lastId = `ECC-${year}-0000`;
    }
    const parts = lastId.split("-");
    const numericalPart = parts[2];
    let converted_value = parseInt(numericalPart, 10);
    const incremented_value = converted_value + 1;
    const number = String(incremented_value).padStart(4, "0");
    const id = `CID-${year}-${number}`;
    return id;
};
exports.GenerateId = GenerateId;
