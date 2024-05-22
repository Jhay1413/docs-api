import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { LoginBody } from "./auth.schema";
import { db } from "../../prisma";
import { signJwt } from "./auth.utils";
import { checkUserAccountExists } from "./auth.service";
import jwt from "jsonwebtoken";
export const loginHander = async (
  req: Request<{}, {}, LoginBody>,
  res: Response
) => {
  const { ...rest } = req.body;

  try {
    const user = await checkUserAccountExists(rest.email);
    if (!user) {
      return res.status(StatusCodes.BAD_REQUEST).send("User not found");
    }
    if (user.password !== rest.password) {
      console.log("asdasdas")
      return res.status(StatusCodes.UNAUTHORIZED).send("Incorrect password");
    }

    const accessToken = jwt.sign(
      { email: user.email },
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      { expiresIn: "1d" }
    );
    const refreshToken = jwt.sign(
      { email: user.email },
      process.env.JWT_REFRESH_TOKEN_SECRET!,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: true,
      sameSite: "strict",
    });

    const payload = {
      email: user.email,
      name: user.userInfo?.firstName,
      accountRole: user.accountRole,
      accountId: user.id,
      userId: user.userInfo?.id,
      assignedDivision: user.userInfo?.assignedDivision,
      assignedSection: user.userInfo?.assignedPosition,
      assignedPosition: user.userInfo?.assignedPosition,
    };
    res.status(StatusCodes.OK).send(payload);
  } catch (error) {
    console.log(error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .send("Something went wrong while logging in");
  }
};

export const logoutHandler = async (req: Request, res: Response) => {
  return res.status(201).send("Logout route");
};
