"use strict";
// import { Request, Response } from "express";
// import { db } from "../prisma";
// export const restoreEndpoint = async (req: Request, res: Response) => {
//   try {
//     const transactions = await db.transaction.findMany({
//       select: {
//         id: true, // Adjust this based on your requirements
//         transactionLogs: {
//           orderBy: {
//             dateForwarded: "desc", // Order by the createdAt field to get the latest
//           },
//           take: 1, // Get the latest log for each transaction
//         },
//       },
//     });
//     const attachments = transactions.map((data) => {
//       const attachments = data.transactionLogs.map((data) => {
//         const parsed = JSON.parse(data.attachments);
//         const transactionId = data.transactionId;
//         const added_id = parsed.map((data: any) => {
//           return { ...data, transactionId: transactionId, createdAt: new Date(data.createdAt).toISOString() };
//         });
//         return added_id;
//       });
//       return attachments;
//     });
//     const first_flat = attachments.flat();
//     // const response = await db.transactionLogs.findMany({
//     //   select: {
//     //     attachments: true,
//     //     transactionId: true,
//     //   },
//     // });
//     // const parsedData = response.map((item) => {
//     //   const data = JSON.parse(item.attachments);
//     //   const new_map = data.map((data: any) => {
//     //     return {
//     //       ...data,
//     //       transactionId: item.transactionId,
//     //       createdAt: new Date(data.createdAt).toISOString(),
//     //     };
//     //   });
//     //   return new_map;
//     // });
//     // const data = parsedData.flat();
//     // const uniqueData = data.reduce((acc, current) => {
//     //   // Use the transactionId as the unique key
//     //   const key = current.id;
//     //   // Check if this transactionId is already in the accumulator
//     //   if (!acc[key]) {
//     //     // If not, add it
//     //     acc[key] = current;
//     //   } else {
//     //     // If it is, compare the createdAt dates
//     //     const existingItem = acc[key];
//     //     if (new Date(current.createdAt) > new Date(existingItem.createdAt)) {
//     //       // Update to the one with the latest createdAt
//     //       acc[key] = current;
//     //     }
//     //   }
//     //   return acc;
//     // }, {});
//     // // Convert the accumulator object back to an array
//     // const finalData: any = Object.values(uniqueData);
//     // const uniqueIds = new Set();
//     // const unique = finalData.filter((item: any) => {
//     //   if (uniqueIds.has(item.id)) {
//     //     return false; // Not unique
//     //   }
//     //   uniqueIds.add(item.id); // Mark this ID as seen
//     //   return true; // Unique
//     // });
//     // await db.attachment.createMany({
//     //   data: unique,
//     // });
//     const second_flat = first_flat.flat();
//     await db.attachment.createMany({
//       data: second_flat,
//     });
//     res.status(200).json(second_flat);
//   } catch (error) {
//     console.log(error);
//     res.status(500).json("something went wrong ");
//   }
// };
