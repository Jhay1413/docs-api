import express, { Request, Response, NextFunction } from "express";
const allowedIPs = ["192.168.111.1/24"];
const restrictIP = (req: Request, res: Response, next: NextFunction) => {
  const requestIP = req.ip; // Get the IP address from the request

  // Check if the IP is in the allowed list
  if (!allowedIPs.includes(requestIP!)) {
    return res.status(403).json({ message: "Access denied: Your IP is not allowed." });
  }

  next(); // Proceed to the next middleware if IP is allowed
};
export { restrictIP };
