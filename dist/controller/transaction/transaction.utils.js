"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanedDataUtils = void 0;
const cleanedDataUtils = (data, forwaderData, receiver) => {
    var _a, _b, _c;
    const forwarder = forwaderData ? forwaderData : (_a = data.forwarder) === null || _a === void 0 ? void 0 : _a.userInfo;
    const cleanedData = Object.assign(Object.assign({}, data), { company: (_b = data.company) === null || _b === void 0 ? void 0 : _b.companyName, project: (_c = data.project) === null || _c === void 0 ? void 0 : _c.projectName, forwarder: `${forwarder === null || forwarder === void 0 ? void 0 : forwarder.firstName} - ${forwarder === null || forwarder === void 0 ? void 0 : forwarder.lastName}`, attachments: data.attachments, receiver: receiver ? `${receiver === null || receiver === void 0 ? void 0 : receiver.firstName} - ${receiver === null || receiver === void 0 ? void 0 : receiver.lastName}` : null, transactionId: data.id });
    const { id, companyId, projectId, forwarderId } = cleanedData, payload = __rest(cleanedData, ["id", "companyId", "projectId", "forwarderId"]);
    const createData = Object.assign(Object.assign({}, payload), { transactionId: payload.transactionId, dueDate: payload.dueDate, dateForwarded: payload.dateForwarded, attachments: payload.attachments });
    return createData;
};
exports.cleanedDataUtils = cleanedDataUtils;
