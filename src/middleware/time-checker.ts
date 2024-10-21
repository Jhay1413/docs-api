import { Request, Response, NextFunction } from "express";

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

  console.log(currentHour);
  if (currentHour >= 17) {
    // 5 PM in 24-hour format
    return res.status(403).json({ message: "Access Denied." });
  }
  next();
};

export { disableAfter5PM };
