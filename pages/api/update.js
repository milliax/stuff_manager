import prisma from "../../lib/prisma"

export default async function query(req, res) {
    if (req.method === "POST") {
        console.log(req.body)

        try {
            const body = JSON.parse(req.body)
            // {"mode":"amount","roomNumber":"12619","id":1,"amount":2,"token":"milliax"}

            // authenticate

            const valid_user = await prisma.user.findFirst({
                where: {
                    token: body.token,
                    rooms: {
                        some: {
                            room: {
                                roomId: body.roomId,
                                stuff: {
                                    id: body.id
                                }
                            }
                        }
                    }
                }
            })

            console.log(valid_user)

            switch (body.mode) {
                case "amount":
                    // update amount
                    const update_amount = await prisma.stuff.update({
                        where: {
                            id: body.id,
                        }, data: {
                            amount: body.amount
                        }
                    })
                    console.log(update_amount)
                    break;
                case "name":
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