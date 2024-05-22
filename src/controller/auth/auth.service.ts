import { db } from "../../prisma";

export const checkUserAccountExists = async (email: string) => {

    const user = await db.userAccounts.findFirst({
      where: {
        email
      },
      include:{
        userInfo: true
      }
    })
    return user;
  }