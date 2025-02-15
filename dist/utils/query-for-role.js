"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createQueryForRole = void 0;
const createQueryForRole = (role, targetDivision, team, assignedDivision, assignedSection) => {
    switch (role) {
        case "RECORDS":
            return {
                OR: [
                    {
                        account: { accountRole: "MANAGER" },
                    },
                    { account: { accountRole: "QA" } },
                    { account: { accountRole: "DMS" } },
                ],
            };
        case "QA":
            return {
                account: { accountRole: "RECORDS" },
            };
        case "DMS":
            return {
                assignedDivision: "Finance",
                account: { accountRole: "MANAGER" },
            };
        case "MANAGER":
            if (assignedDivision === "Finance") {
                return {
                    OR: [
                        { AND: [{ assignedDivision: "Admin Department" }, { account: { accountRole: "MANAGER" } }] },
                        {
                            AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "CH" } }],
                        },
                    ],
                };
            }
            else if (assignedDivision === "Admin Department") {
                return {
                    OR: [
                        { AND: [{ assignedDivision: "Finance" }, { account: { accountRole: "MANAGER" } }] },
                        {
                            AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "CH" } }],
                        },
                        { account: { accountRole: "RECORDS" } },
                    ],
                };
            }
            else {
                return {
                    OR: [
                        {
                            AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "TL" } }],
                        },
                        { account: { accountRole: "RECORDS" } },
                    ],
                };
            }
        case "TL":
            return {
                OR: [
                    {
                        AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "MANAGER" } }],
                    },
                    {
                        AND: [{ assignedDivision: assignedDivision }, { assignedSection: assignedSection }, { account: { accountRole: "CH" } }],
                    },
                ],
            };
        case "CH":
            if (targetDivision === "Finance" || targetDivision === "Admin Department") {
                return {
                    assignedDivision: targetDivision,
                    account: { accountRole: "MANAGER" },
                };
            }
            else {
                return {
                    assignedDivision: assignedDivision,
                    assignedSection: assignedSection,
                    account: { accountRole: "TL" },
                };
            }
        default:
            return null;
    }
};
exports.createQueryForRole = createQueryForRole;
