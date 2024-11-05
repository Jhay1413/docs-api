import { Roles } from "@prisma/client";

const createQueryForRole = (role: string, targetDivision: string, team: string | null, assignedDivision: string, assignedSection: string) => {
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
      } else if (assignedDivision === "Admin Department") {
        return {
          OR: [
            { AND: [{ assignedDivision: "Finance" }, { account: { accountRole: "MANAGER" } }] },
            {
              AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "CH" } }],
            },
            { account: { accountRole: "RECORDS" } },
          ],
        };
      } else {
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
            AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "TL" } }],
          },
          {
            AND: [{ assignedDivision: assignedDivision }, { account: { accountRole: "MANAGER" } }],
          },
          {
            AND: [{ assignedDivision: assignedDivision }, { assignedSection: assignedSection }, { account: { accountRole: "CH" } }],
          },
        ],
      };

    case "CH":
      if (assignedDivision === "Finance" || assignedDivision === "Admin Department") {
        return {
          OR: [
            {
              AND: [{ assignedDivision: targetDivision }, { account: { accountRole: "MANAGER" } }],
            },
            { account: { accountRole: "RECORDS" } },
          ],
        };
      } else {
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

export const queryBuilderForTickets = (type: string, division: string, section: string, role: string, mode: string, requesteeId?: string) => {
  switch (mode) {
    case "insert":
      if (type === "EPD") {
        return {
          accountRole: "TL",
          userInfo: {
            assignedSection: "EPD",
          },
        };
      } else if (type === "IT") {
        return {
          accountRole: "TL",
          userInfo: {
            assignedSection: "ITOP",
          },
        };
      } else if (type === "Marketing") {
        return {
          userInfo: {
            assignedDivision: "Marketing Department",
          },
        };
      }
      break;
    case "forward":
      if (role === "TL") {
        return {
          OR: [
            {
              id: requesteeId,
            },
            {
              AND: [
                {
                  userInfo: {
                    assignedDivision: division,
                  },
                },
                {
                  accountRole: "Manager",
                },
              ],
            },
            {
              AND: [
                {
                  accountRole: "CH",
                },
                {
                  userInfo: {
                    assignedSection: section,
                  },
                },
              ],
            },
          ],
        };
      }
  }
};

export { createQueryForRole };
