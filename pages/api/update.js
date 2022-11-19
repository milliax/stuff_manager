import prisma from "../../lib/prisma"

export default async function query(req, res) {
    if (req.method === "POST") {
        // console.log(req.body)

        try {
            const body = JSON.parse(req.body)
            console.log(body)
            // {"mode":"amount","roomNumber":"12619","id":1,"amount":2,"token":"milliax"}

            // authenticate

            const valid_user = await prisma.user.findMany({
                // use token to verify whether user has privilege to the table
                where: {
                    AND: [
                        { token: body.token },
                        {
                            rooms: {
                                some: {
                                    stuff: {
                                        some: {
                                            id: body.id
                                        }
                                    }
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

            switch (body.mode) {
                case "amount":
                    // update amount
                    if(body.amount <= 0){
                        const update_amount = await prisma.stuff.delete({
                            where: {
                                id: body.id
                            }
                        })
                    }else{
                        const update_amount = await prisma.stuff.update({
                            where: {
                                id: body.id,
                            }, data: {
                                amount: body.amount
                            }
                        })
                    }
                    // console.log(update_amount)
                    break;
                case "name":
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
                    const update_name = await prisma.stuff.update({
                        where: {
                            id: body.id
                        }, data: {
                            name: body.name
                        }
                    })
                    console.log(update_name)
                    break;
                default:
                    console.log('wrong api call')
            }
        } catch (err) {
            console.log(`Error: ${err}`)
            return res.status(502)
        }
        return res.status(200).json({ ok: true })
    }
    return res.status(405)
}