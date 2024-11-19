import { Request, Response } from "express";
import { RegisterBody, TUserInfoWithSignedUrl } from "./user.schema";
import { db } from "../../prisma";
import { StatusCodes } from "http-status-codes";
import { getSignedUrlFromS3, uploadImageToS3 } from "../../services/aws-config";
import {
  checkUserIdExists,
  getAccountById,
  getUserInfoForForwardTransaction,
  getUsersForTicketForwarding,
  insertUpdatedImageUrl,
  insertUpdatedUserInfo,
  insertUserInfo,
} from "./user.service";
import { createQueryForRole, queryBuilderForTickets } from "../../utils/query-for-role";
import { Roles } from "@prisma/client";
import { String } from "aws-sdk/clients/acm";

export const changeProfile = async (req: Request, res: Response) => {
  const file = req.file;
  const id = req.params.id;
  try {
    if (!file) {
      throw new Error("No file provided");
    }
    const url = await uploadImageToS3(file);

    //const signedUrl = await getSignedUrlFromS3(url);

    const user = await insertUpdatedImageUrl(id, url);

    res.status(StatusCodes.CREATED).send({ user });
  } catch (error: any) {
    console.error("Error in changeProfile:", error.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while updating the user profile ! ");
  }
};
export const getUser = async (req: Request<{ id: string }, {}, {}>, res: Response) => {
  try {
    const id = req.params.id;
    const user = await db.userInfo.findUnique({
      where: {
        id,
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
    if (!user) return res.status(StatusCodes.NOT_FOUND).send("User not found");

    if (user.imageUrl) {
      const signedUrl = await getSignedUrlFromS3(user.imageUrl);
      return res.status(StatusCodes.OK).send({ ...user, signedUrl });
    }
    return res.status(StatusCodes.OK).send(user);
  } catch (error) {
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while fetching user - controller!");
  }
};
export const registerUser = async (req: Request<{}, {}, RegisterBody>, res: Response) => {
  const data = req.body;
  const file = req.file;
  var imageUrl = null;
  try {
    if (file) {
      imageUrl = await uploadImageToS3(file);

      if (!imageUrl) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Error uploading image");
      }
    }
    await insertUserInfo({ ...data, imageUrl });

    res.status(StatusCodes.CREATED).send("User created successfully");
  } catch (error) {
    console.log(error);
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while creating user");
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await db.userInfo.findMany({
      select: {
        id: true,
        employeeId: true,
        firstName: true,
        lastName: true,
        assignedDivision: true,
        assignedSection: true,
        assignedPosition: true,
        dateStarted: true,
        jobStatus: true,
        birthDate: true,
        imageUrl: true,
      },
    });

    const usersWithSignedUrls: TUserInfoWithSignedUrl[] = await Promise.all(
      users.map(async (user: any) => {
        if (!user.imageUrl) return user;
        const signedUrl = await getSignedUrlFromS3(user.imageUrl);
        const { imageUrl, ...rest } = user;
        return { ...rest, signedUrl };
      }),
    );

    return res.status(StatusCodes.OK).send(usersWithSignedUrls);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while fetching users - controller!");
  }
};
export const updateUser = async (req: Request<{ id: string }, {}, RegisterBody>, res: Response) => {
  const id = req.params.id;

  const data = req.body;

  const dataWithId = { ...data, id };
  try {
    const checkifExist = await checkUserIdExists(dataWithId.id);
    if (!checkifExist) {
      return res.status(StatusCodes.NOT_FOUND).send("User not found");
    }
    await insertUpdatedUserInfo(dataWithId);

    res.status(StatusCodes.OK).send("User updated successfully");
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while updating user - controller!");
  }
};

export const userAccounts = async (req: Request, res: Response) => {
  try {
    const users = await db.userAccounts.findMany();
    return res.status(StatusCodes.OK).send(users);
  } catch (error) {
    console.log(error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("Something went wrong while fetching user accounts!");
  }
};

export const fetchUserByRoleAccess = async (id: string, targetDivision: string, team: string | null) => {
  try {
    const account = await getAccountById(id);

    if (!account) throw new Error("No user found");

    const query = createQueryForRole(
      account?.accountRole,
      targetDivision,
      team,
      account?.userInfo?.assignedDivision!,
      account.userInfo?.assignedSection!,
    );

    const response = await getUserInfoForForwardTransaction(query);

    return response;
    // else if()
  } catch (error) {
    console.log(error);
    throw new Error("something went wrong");
  }
};
export const fetchUsersForTicketForwarding = async (division: string, section: string, role: String, mode: string, requesteeId?: string) => {
  try {
    const query = queryBuilderForTickets(division, section, role, mode, requesteeId);

    console.log(query);
    const usersBySectionOrRole = await getUsersForTicketForwarding(query);

    return usersBySectionOrRole;
  } catch (error) {
    throw new Error("Something went wrong");
  }
};
