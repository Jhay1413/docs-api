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
exports.fetchUserByRoleAccess = exports.userAccounts = exports.updateUser = exports.getUsers = exports.registerUser = exports.getUser = exports.changeProfile = void 0;
const prisma_1 = require("../../prisma");
const http_status_codes_1 = require("http-status-codes");
const aws_config_1 = require("../../services/aws-config");
const user_service_1 = require("./user.service");
const query_for_role_1 = require("../../utils/query-for-role");
const changeProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    const id = req.params.id;
    try {
        if (!file) {
            throw new Error("No file provided");
        }
        const url = yield (0, aws_config_1.uploadImageToS3)(file);
        //const signedUrl = await getSignedUrlFromS3(url);
        const user = yield (0, user_service_1.insertUpdatedImageUrl)(id, url);
        res.status(http_status_codes_1.StatusCodes.CREATED).send({ user });
    }
    catch (error) {
        console.error("Error in changeProfile:", error.message);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while updating the user profile ! ");
    }
});
exports.changeProfile = changeProfile;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const user = yield prisma_1.db.userInfo.findUnique({
            where: {
                id,
            },
            omit: {
                createdAt: true,
                updatedAt: true,
            },
            include: {
                account: {
                    omit: {
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
        console.log(user + "adasdsadassda");
        if (!user)
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("User not found");
        if (user.imageUrl) {
            const signedUrl = yield (0, aws_config_1.getSignedUrlFromS3)(user.imageUrl);
            return res.status(http_status_codes_1.StatusCodes.OK).send(Object.assign(Object.assign({}, user), { signedUrl }));
        }
        return res.status(http_status_codes_1.StatusCodes.OK).send(user);
    }
    catch (error) {
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while fetching user - controller!");
    }
});
exports.getUser = getUser;
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.body;
    const file = req.file;
    var imageUrl = null;
    try {
        if (file) {
            imageUrl = yield (0, aws_config_1.uploadImageToS3)(file);
            if (!imageUrl) {
                return res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Error uploading image");
            }
        }
        yield (0, user_service_1.insertUserInfo)(Object.assign(Object.assign({}, data), { imageUrl }));
        res.status(http_status_codes_1.StatusCodes.CREATED).send("User created successfully");
    }
    catch (error) {
        console.log(error);
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while creating user");
    }
});
exports.registerUser = registerUser;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.db.userInfo.findMany({
            select: {
                id: true,
                employeeId: true,
                firstName: true,
                lastName: true,
                assignedDivision: true,
                assignedSection: true,
                assignedPosition: true,
                dateStarted: true,
                jobStatus: true,
                birthDate: true,
                imageUrl: true,
            },
        });
        const usersWithSignedUrls = yield Promise.all(users.map((user) => __awaiter(void 0, void 0, void 0, function* () {
            if (!user.imageUrl)
                return user;
            const signedUrl = yield (0, aws_config_1.getSignedUrlFromS3)(user.imageUrl);
            const { imageUrl } = user, rest = __rest(user, ["imageUrl"]);
            return Object.assign(Object.assign({}, rest), { signedUrl });
        })));
        return res.status(http_status_codes_1.StatusCodes.OK).send(usersWithSignedUrls);
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while fetching users - controller!");
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const data = req.body;
    const dataWithId = Object.assign(Object.assign({}, data), { id });
    try {
        const checkifExist = yield (0, user_service_1.checkUserIdExists)(dataWithId.id);
        if (!checkifExist) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).send("User not found");
        }
        yield (0, user_service_1.insertUpdatedUserInfo)(dataWithId);
        res.status(http_status_codes_1.StatusCodes.OK).send("User updated successfully");
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while updating user - controller!");
    }
});
exports.updateUser = updateUser;
const userAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield prisma_1.db.userAccounts.findMany();
        return res.status(http_status_codes_1.StatusCodes.OK).send(users);
    }
    catch (error) {
        console.log(error);
        res.status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while fetching user accounts!");
    }
});
exports.userAccounts = userAccounts;
const fetchUserByRoleAccess = (id, targetDivision, team) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const account = yield (0, user_service_1.getAccountById)(id);
        if (!account)
            throw new Error("No user found");
        const query = (0, query_for_role_1.createQueryForRole)(account === null || account === void 0 ? void 0 : account.accountRole, targetDivision, team, (_a = account === null || account === void 0 ? void 0 : account.userInfo) === null || _a === void 0 ? void 0 : _a.assignedDivision, (_b = account.userInfo) === null || _b === void 0 ? void 0 : _b.assignedSection);
        console.log(query);
        const response = yield (0, user_service_1.getUserInfoForForwardTransaction)(query);
        return response;
        // else if()
    }
    catch (error) {
        console.log(error);
        throw new Error("something went wrong");
    }
});
exports.fetchUserByRoleAccess = fetchUserByRoleAccess;
