"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userInfoWithSignedUrl = exports.userInfoWithProfile = exports.userWithIdSchema = exports.userLoginSchema = exports.userRegisterSchema = exports.accountSchema = exports.userInfoSchema = void 0;
const zod_1 = require("zod");
const zod_2 = __importDefault(require("zod"));
exports.userInfoSchema = {
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "email is required",
        }),
        employeeId: (0, zod_1.string)({
            required_error: ("userId is required")
        }),
        firstName: (0, zod_1.string)({
            required_error: "firstName is required",
        }).min(2, "firstName must be at least 6 characters"),
        lastName: (0, zod_1.string)({
            required_error: "lastName is required",
        }).min(2, "lastName must be at least 6 characters"),
        assignedDivision: (0, zod_1.string)({
            required_error: "assignedDivision is required",
        }),
        assignedPosition: (0, zod_1.string)({
            required_error: "assignedPosition is required",
        }),
        assignedSection: (0, zod_1.string)({
            required_error: "assignedSection is required",
        }),
        dateStarted: zod_2.default.string({
            required_error: "date is required",
        }),
        jobStatus: (0, zod_1.string)({
            required_error: "jobStatus is required",
        }),
        contactNumber: (0, zod_1.string)({
            required_error: "contactNumber is required",
        }),
        birthDate: zod_2.default.string({
            required_error: "birthDate is required",
        }),
        middleName: zod_2.default.nullable(zod_2.default.string({
            required_error: "middleName is required",
        }))
    }),
};
exports.accountSchema = {
    body: (0, zod_1.object)({
        accountType: (0, zod_1.string)({
            required_error: "accountType is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        }),
    }),
};
exports.userRegisterSchema = exports.userInfoSchema.body.extend({
    password: (0, zod_1.string)({
        required_error: "password is required",
    }),
    accountRole: (0, zod_1.string)({
        required_error: "accountType is required",
    }),
});
exports.userLoginSchema = {
    body: (0, zod_1.object)({
        email: (0, zod_1.string)({
            required_error: "email is required",
        }),
        password: (0, zod_1.string)({
            required_error: "password is required",
        }),
    }),
};
exports.userWithIdSchema = exports.userInfoSchema.body.extend({
    id: zod_2.default.string({
        message: "id is required"
    })
});
exports.userInfoWithProfile = exports.userRegisterSchema.extend({
    imageUrl: zod_2.default.nullable(zod_2.default.string()),
});
exports.userInfoWithSignedUrl = exports.userRegisterSchema
    .extend({
    imageUrl: zod_2.default.nullable(zod_2.default.string({
        message: "imageUrl is required",
    })),
    dateStarted: zod_2.default.date(),
})
    .omit({
    dateStarted: true,
    password: true,
    accountRole: true,
});
