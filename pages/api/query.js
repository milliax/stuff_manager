// query keys: [roomNumber,token(authorization)]
// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

import prisma from "../../lib/prisma"

export default async function query(req, res) {
    if (req.method === "GET") {
        //console.log(req.query)
        //console.log(req.body)
        // TODO: Need Authentication
        const roomNumber = req.query.roomNumber
        const token = req.query.token

        const all_stuff = await prisma.room.findFirst({
            where: { roomNumber }
        }).stuff({
            select: {
                name: true,
                amount: true,
                id: true,
            }
        })
        // console.log(all_stuff)
        // console.log(typeof(all_stuff))
        return res.status(200).send(JSON.stringify(all_stuff))
    }
    return res.status(405)
}