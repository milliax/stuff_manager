import { SERVER_PROPS_ID } from "next/dist/shared/lib/constants"
import prisma from "../../lib/prisma"

export default async function create(req, res) {
    if (req.method === "POST") {
        try {
            const body = JSON.parse(req.body)
            console.log(body)

            const valid_user = await prisma.user.findMany({
                // use token to verify whether user has privilege to the table
                where: {
                    AND: [
                        { token: body.token },
                        {
                            rooms: {
                                some:{
                                    id: body.roomId
                                }
                            }
                        }
                    ]
                }
            })

            // console.log(valid_user)
            if (valid_user.length === 0) {
                // invalid user
                return res.status(403)
            }


            const result = await prisma.stuff.findMany({
                where: {
                    name:  body.name,
                    roomId: body.roomId
                }
            })
            if(result.length >= 1){
                // name in this room existed
                return res.status(403).json({
                    error: "name existed"
                })
            }

            const stuff = await prisma.stuff.create({
                data: {
                    name: body.name,
                    amount: parseInt(body.value),
                    room: {
                        connect: {
                            id: body.roomId
                        }
                    }
                }
            })
            console.log("log")
            console.log(stuff)
        } catch (err) {
            console.log(`Error: ${err}`)
        }
        res.status(200).json({
            status: "success",
            token: "something"
        })
    }
    return res.status(405)
}