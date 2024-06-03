import express from "express"
import { processRequestBody } from "zod-express-middleware";
import { userInfoSchema, userRegisterSchema } from "./user.schema";
import { changeProfile, getUser, getUsers, registerUser, updateUser, userAccounts } from "./user.controller";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


//accounts
router.get("/account",userAccounts);


router.put("/changeProfile/:id", upload.single("img"), changeProfile);
router.post("/register", upload.single("imageFile"), processRequestBody(userRegisterSchema), registerUser);
router.put("/:id", upload.single("imageFile"), processRequestBody(userInfoSchema.body), updateUser);

// General routes defined last
router.get("/", getUsers);
router.get("/:id", getUser);
export default router