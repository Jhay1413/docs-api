import { db } from "../../prisma";
import { notification } from "./transaction.schema";
import z from "zod"


export class SocketService{


    public async getNotif(id:string){
        try {
            const response = await db.notification.findMany({
                where:{
                    receiverId:id,
                }
            })
            return response;
        } catch (error) {
            throw new Error("Something went wrong while fetching UnreadNotif")
        }

    }

    public async notifyUser(socketId:string,notifications : z.infer<typeof notification>[]){

    }
}