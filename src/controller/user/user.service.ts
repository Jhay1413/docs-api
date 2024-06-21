import { Roles } from "@prisma/client";
import { db } from "../../prisma";
import { TUserInfoWithProfile, TUserWithId } from "./user.schema";


export const insertUserInfo = async (data: TUserInfoWithProfile) => {
  try {
    const {
      email,
      firstName,
      lastName,
      assignedDivision,
      assignedPosition,
      assignedSection,
      dateStarted,
      jobStatus,
      password,
      accountRole,
      contactNumber,
      imageUrl,
      birthDate,
      middleName,
      employeeId
    } = data;

    await db.userInfo.create({
      data: {
        employeeId,
        email,
        firstName,
        lastName,
        assignedPosition,
        assignedDivision,
        assignedSection,
        dateStarted,
        jobStatus,
        contactNumber,
        imageUrl,
        birthDate,
        middleName,
        account: {
          create: {
            email,
            password,
            accountRole: accountRole as Roles,
          },
        },
      },
    });
    
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong while creating user - service!")
  }
};


export const insertUpdatedUserInfo = async (data: TUserWithId) => {

  try {
      await db.userInfo.update({
        where:{
          id: data.id
        },
        data:{
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          assignedDivision: data.assignedDivision,
          assignedPosition: data.assignedPosition,
          assignedSection: data.assignedSection,
          dateStarted: data.dateStarted,
          jobStatus: data.jobStatus,
          contactNumber: data.contactNumber,
          
        }
      })
      return "User updated successfully"
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong while updating user - service!")
  }
}

export const insertUpdatedImageUrl = async (id:string,url:string)=>{
  try {
    const user = await db.userInfo.update({
      where:{
        id:id
      },
      data:{
        imageUrl:url
      },
      omit: {
        createdAt: true,
        updatedAt: true,
      },
      include: {
        account: {
          omit: {
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
    return user
  } catch (error) {
    throw new Error("Error while updating the user profile !")
  }
}
export const checkUserIdExists = async (id: string) => {
  try {
    const isExist = await db.userInfo.findUnique({
      where: {
        id,
      },
    
    })
    if(isExist){
      return true
    }
    return false
  } catch (error:any) {
    console.log(error.message)
    throw new Error("Something went wrong while checking user id - service!")
  }
}