"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const zod_express_middleware_1 = require("zod-express-middleware");
const user_schema_1 = require("./user.schema");
const user_controller_1 = require("./user.controller");
const multer_1 = __importDefault(require("multer"));
const router = express_1.default.Router();
const upload = (0, multer_1.default)({ storage: multer_1.default.memoryStorage() });
//accounts
router.get("/account", user_controller_1.userAccounts);
router.put("/changeProfile/:id", upload.single("img"), user_controller_1.changeProfile);
router.post("/register", upload.single("imageFile"), (0, zod_express_middleware_1.processRequestBody)(user_schema_1.userRegisterSchema), user_controller_1.registerUser);
router.put("/:id", upload.single("imageFile"), (0, zod_express_middleware_1.processRequestBody)(user_schema_1.userInfoSchema.body), user_controller_1.updateUser);
// General routes defined last
router.get("/:id", user_controller_1.getUser);
router.get("/", user_controller_1.getUsers);
exports.default = router;
