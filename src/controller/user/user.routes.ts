import express from "express"
import { processRequestBody } from "zod-express-middleware";
import { userInfoSchema, userRegisterSchema } from "./user.schema";
import { getUser, registerUser, updateUser, userAccounts } from "./user.controller";
import multer from "multer";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });


//accounts
router.get("/account",userAccounts);

//usuers
router.post("/register",upload.single("imageFile"),processRequestBody(userRegisterSchema),registerUser)
router.put("/:id",upload.single("imageFile"),processRequestBody(userInfoSchema.body),updateUser)
router.get("/",getUser);
export default router