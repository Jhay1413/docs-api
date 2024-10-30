import { db } from "../prisma";
import { Request, Response } from "express";
export const removePdf = async (req: Request, res: Response) => {
  try {
    const data = await db.completeStaffWork.findMany();

    for (const csw of data) {
      const filteredAttachments = csw.attachments.filter((path) => !/\.pdf/.test(path));

      await db.completeStaffWork.update({
        where: { id: csw.id }, // Use your unique identifier
        data: {
          attachments: filteredAttachments, // Set the filtered attachments
        },
      });
    }
    res.status(200).json();
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};
