import { Request, Response, NextFunction } from "express";
const disableAfter5PM = (req: Request, res: Response, next: NextFunction) => {
  const now = new Date();
  const currentHour = now.getHours();

  if (currentHour >= 8) {
    return res.status(403).json({ message: "Access Denied. " });
  }
  next();
};
export { disableAfter5PM };
