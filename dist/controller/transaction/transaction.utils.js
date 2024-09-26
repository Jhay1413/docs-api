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
const cleanedDataUtils = (data) => {
    var _a, _b, _c, _d, _e, _f;
    const cleanedData = Object.assign(Object.assign({}, data), { company: (_a = data.company) === null || _a === void 0 ? void 0 : _a.companyName, project: (_b = data.project) === null || _b === void 0 ? void 0 : _b.projectName, forwarder: `${(_c = data.forwarder) === null || _c === void 0 ? void 0 : _c.email} - ${(_d = data.forwarder) === null || _d === void 0 ? void 0 : _d.accountRole}`, attachments: data.attachments, receiver: `${(_e = data.receiver) === null || _e === void 0 ? void 0 : _e.email} - ${(_f = data.receiver) === null || _f === void 0 ? void 0 : _f.accountRole}` || null, transactionId: data.id });
    const { id } = cleanedData, payload = __rest(cleanedData, ["id"]);
    const createData = Object.assign(Object.assign({}, payload), { transactionId: payload.transactionId, dueDate: payload.dueDate, dateForwarded: payload.dateForwarded, attachments: JSON.stringify(payload.attachments) });
    return createData;
};
exports.cleanedDataUtils = cleanedDataUtils;
