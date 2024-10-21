import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import z from "zod";

const decodedSchema = z.object({
  email: z.string(),
  role: z.string(),
  iat: z.number(),
  exp: z.number(),
});
type TDecoded = z.infer<typeof decodedSchema>;
function getDateAndTimeInManila(): Date {
  const options: Intl.DateTimeFormatOptions = {
    timeZone: "Asia/Manila",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false, // Use 24-hour format
  };

  // Create a new Date object
  const date = new Date();

  // Format the date and time to Manila's time zone
  const manilaTime = date.toLocaleString("en-PH", options);

  // Convert the formatted string back to a Date object
  return new Date(manilaTime);
}

const disableAfter5PM = (req: Request, res: Response, next: NextFunction) => {
  const manilaDateTime = getDateAndTimeInManila();
  const currentHour = manilaDateTime.getHours();
  const accessToken = req.cookies.accessToken;
  console.log(currentHour);
  if (!accessToken) {
    return res.status(401).send("Unauthorized");
  }
  jwt.verify(accessToken, process.env.JWT_ACCESS_TOKEN_SECRET!, (err: VerifyErrors | null, decoded: any) => {
    if (err) {
      console.log(err);
      return res.status(401).send("Unauthorized");
    }

    const decodedPayload = decoded as TDecoded;
    if (decodedPayload.role === "MANAGER" || decodedPayload.role === "SUPERADMIN") {
      return next();
    }

    if (currentHour >= 12) {
      console.log(decodedPayload.role);
      return res.status(403).json({ message: "Access Denied." });
    }
    return next();
  });
};

export { disableAfter5PM };
