// import { Request, Response } from "express";
// import { db } from "../prisma";

// export const transaferUrl = async (req: Request, res: Response) => {
//   try {
//     const attachments = await db.completeStaffWork.findMany();

//     for (const attachment of attachments) {
//       if (attachment.attachmentUrl) {
//         const attachmentsArray = [attachment.attachmentUrl];

//         await db.completeStaffWork.update({
//           where: {
//             id: attachment.id,
//           },
//           data: {
//             attachments: attachmentsArray,
//           },
//         });
//       }
//     }
//     res.status(200).json("updatedSuccessfully");
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("something went wrong ");
//   }
// };
