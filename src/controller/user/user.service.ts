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
      employeeId,
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
    console.log(error);
    throw new Error("Something went wrong while creating user - service!");
  }
};

export const insertUpdatedUserInfo = async (data: TUserWithId) => {
  try {
    await db.userInfo.update({
      where: {
        id: data.id,
      },
      data: {
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
        assignedDivision: data.assignedDivision,
        assignedPosition: data.assignedPosition,
        assignedSection: data.assignedSection,
        dateStarted: data.dateStarted,
        jobStatus: data.jobStatus,
        contactNumber: data.contactNumber,
      },
    });
    return "User updated successfully";
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong while updating user - service!");
  }
};

export const insertUpdatedImageUrl = async (id: string, url: string) => {
  try {
    const user = await db.userInfo.update({
      where: {
        id: id,
      },
      data: {
        imageUrl: url,
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
    });
    return user;
  } catch (error) {
    throw new Error("Error while updating the user profile !");
  }
};
export const checkUserIdExists = async (id: string) => {
  try {
    const isExist = await db.userInfo.findUnique({
      where: {
        id,
      },
    });
    if (isExist) {
      return true;
    }
    return false;
  } catch (error: any) {
    console.log(error.message);
    throw new Error("Something went wrong while checking user id - service!");
  }
};
export const getAccountById = async (id: string) => {
  try {
    const result = await db.userAccounts.findUnique({
      where: {
        id: id,
      },
      include: {
        userInfo: true,
      },
    });
    return result;
  } catch (error) {
    throw new Error("something went wrong fetching user");
  }
};
export const getUserInfoByAccountId = async (id: string) => {
  try {
    const result = await db.userInfo.findUnique({
      where: {
        accountId: id,
      },
    });
    return result;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong fetching user");
  }
};
export const getUserInfoForForwardTransaction = async (query: any) => {
  try {
    // console.log(query)
    const result = await db.userInfo.findMany({
      where: query,
      select: {
        accountId: true,
        firstName: true,
        lastName: true,
        account: {
          select: {
            accountRole: true,
          },
        },
      },
    });

    return result;
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong ! ");
  }
};

export const getUsersForTicketForwarding = async (query: any) => {
  try {
    const result = await db.userAccounts.findMany({
      where: query,
      select: {
        id: true,
        userInfo: {
          select: {
            firstName: true,
            lastName: true,
          }
        },
        accountRole: true,
      },
    });

    console.log("result from user service:", result)
    const newResult = result.map(data => {
      return {...data, userInfo: data.userInfo!}
    });
    return newResult;
  } catch (error) {
    console.log(error)
    throw new Error("Something went wrong");
  }
};