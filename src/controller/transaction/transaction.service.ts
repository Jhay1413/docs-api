import { db } from "../../prisma";
import { TDcoumentInfo, TtransactionData } from "./transaction.schema";

export const insertTransactionService = async (data: TtransactionData) => {
  const {
    documentType,
    subject,
    forwardedTo,
    remarks,
    createdBy,
    dueDate,
    forwardedBy,
    toDepartment,
    fromDepartment,
    dateForwarded,
    documentSubType,
    team,
    fileData,
  } = data;
  try {
    await db.documentInfo.create({
      data: {
        documentType,
        subject,
        dueDate,
        createdBy,
        team,
        documentSubType,
        documentHistory: {
          create: {
            forwardedTo,
            remarks,
            subject,
            dateForwarded,
            forwardedBy,
            toDepartment,
            fromDepartment,
            attachments: {
              createMany: {
                data: fileData,
              },
            },
          },
        },
      },
    });
    return true;
  } catch (error) {
    throw new Error("Error creating transaction");
  }
};

export const getDocumentsService = async () => {
  try {
   const documents = await db.documentInfo.findMany({
      relationLoadStrategy:'join',
       include:{
           documentHistory :{
            select:{
                fromDepartment:true,
                toDepartment:true,
            },
              take:1,
              orderBy:{
                createdAt:'asc'
              }
           },
           account:{
             select:{
               userInfo:{
                  select:{
                    firstName:true,
                    lastName:true
                  }
               }
             }
           }
       }
   })
  
  
  const data:TDcoumentInfo[] = []
  documents.map((doc)=>{
      data.push({
          id:doc.id,
          documentType:doc.documentType,
          subject:doc.subject,
          dueDate:doc.dueDate,
          createdBy:doc.createdBy,
          team:doc.team,
          fromDepartment:doc?.documentHistory[0]?.fromDepartment,
          toDepartment:doc?.documentHistory[0]?.toDepartment,
          createdAt:doc.createdAt,
          updatedAt:doc.updatedAt,
          documentSubType:doc.documentSubType,
          createdByName:doc?.account?.userInfo?.firstName + " " + doc?.account?.userInfo?.lastName,
      })
  })
    return data;
  } catch (error) {
    console.log(error);
    throw new Error("Error fetching documents");
  }
};
