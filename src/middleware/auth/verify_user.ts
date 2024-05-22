import { NextFunction, Request, Response } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import z from "zod";
import { TLoginBody } from "../../controller/user/user.schema";
const decodedSchema = z.object({
  email: z.string(),
  iat: z.number(),
  exp: z.number(),
});
type TDecoded = z.infer<typeof decodedSchema>;
export const verifyUser = async (
  req: Request<{}, {}, TLoginBody>,
  res: Response,
  next: NextFunction
) => {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    if (await renewToken(req, res)) {
      next();
    }
  } else {
    jwt.verify(
      accessToken,
      process.env.JWT_ACCESS_TOKEN_SECRET!,
      (err: VerifyErrors | null, decoded: any) => {
        if (err) {
          console.log(err);
          return res.status(401).send("Unauthorized");
        } else {
          const decodedPayload = decoded as TDecoded;

          req.body.email = decodedPayload.email;
          next();
        }
      }
    );
  }
};

const renewToken = (
  req: Request<{}, {}, TLoginBody>,
  res: Response
): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      res.status(401).send("Unauthorized");
      resolve(false);
    } else {
      jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_TOKEN_SECRET!,
        (err: VerifyErrors | null, decoded: any) => {
          if (err) {
            res.status(401).send("Unauthorized");
            resolve(false);
          } else {
            const decodedPayload = decoded as TDecoded;
            req.body.email = decodedPayload.email;
            resolve(true);
          }
        }
      );
    }
  });
};
