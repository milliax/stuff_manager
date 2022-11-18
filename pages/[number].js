import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import Swal from "sweetalert2"
import Link from "next/link"

export default function AvailableStuff({ props }) {
    const [loading, setLoading] = useState(true)
    const [stuff, setStuff] = useState({})
    const router = useRouter()

    const toggleAmountChange = async (index, delta) => {
        // console.log(parseInt(stuff[index]) + delta)
        console.log(index)
        const newNumber = parseInt(stuff[index].amount) + delta
        console.log(newNumber)
        if (newNumber === 0) {
            Swal.fire({
                title: `${stuff[index].name}吃/用完了嗎 ?`,
                icon: "question"
            }).then(result => {
                if (!result.isConfirmed) {
                    return;
                }
            })
        } else {
            try {
                const res = await fetch(`/api/update`, {
                    method: "POST",
                    body: JSON.stringify({
                        mode: "amount",
                        roomNumber: props.roomNumber,
                        id: stuff[index].id,
                        amount: newNumber,
                        token: props.token,
                    })
                })
            } catch (err) {
                console.log(`Error: ${err}`)
            }
            setTimeout(() => (
                updateStuff()
            ), 100)
        }
    }

    const editProductName = async (index) => {
        const result = await Swal.fire({
            title: "輸入要修改成的名稱",
            text: `原本名稱：${index}`,
            inputAttributes: {
                autocapitalize: "off"
            },
            showLoaderOnConfirm: true,
            preConfirm: (newName) => {
                return fetch(`/api/update`, {
                    method: 'POST',
                    body: JSON.stringify({
                        mode: "name",
                        roomNumber: props.roomNumber,
                        item: index,
                        name: newName
                    })
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                }).then(() => {
                    setTimeout(() => {
                        updateStuff()
                    }, 100)
                }).catch(error => {
                    Swal.showValidatationMessage(`Request failed: ${error}`)
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        })

        if (result.isConfirmed) {
            return Swal.fire({
                title: `刪除${index}成功`,
                icon: "success"
            })
        }
    }

    const updateStuff = async () => {
        try {
            const res = await fetch(`/api/query?roomNumber=${props.roomNumber}&token=${props.token}`)
            //console.log("Hello")
            //console.log(res)
            const response = await res.json()
            //console.log(response)
            setStuff(response)
            console.log(response)
        } catch (err) {
            console.log(`Error: ${err}`)
        }
        setLoading(false)
    }

    useEffect(() => {
        if (!props.editable && props.status === "private") {
            Swal.fire({
                title: "Permission Denied",
                icon: "error"
            }).then(() => {
                router.push("/")
            })
        } else {
            //TODO: fetch the latest stuff list
            updateStuff()
        }
    }, [])

    if (props.exist) {
        return (
            <div className="h-screen bg-neutral-50">
                <Link href="/"><div className="text-center pt-3 text-3xl">{props.title}</div></Link>
                <div className="text-right pr-2">Powered by Milliax</div>
                <div className="text-right pr-2 pt-2">Hello: {props.username ? props.username : "undefined"}</div>

                <div className="pt-5 flex flex-row justify-center">
                    <div className="w-1/2 flex flex-col space-y-3">
                        {loading ?
                            Object.keys([1, 2, 3, 4, 5]).map((item, cnt) => (
                                <div className="bg-blue-100 rounded-full px-5 py-4 grid grid-cols-5 gap-3" key={cnt}>
                                    <div className="col-span-3">
                                        <div className="h-2 bg-slate-400 rounded w-full animate-pulse" > </div>
                                    </div>
                                    <div className="col-span-2">
                                        <div className="h-2 bg-slate-400 rounded w-full animate-pulse" > </div>
                                    </div>
                                </div>
                            ))
                            :
                            stuff.map((thing, cnt) => (
                                <div className="bg-blue-100 rounded-full px-5 py-2 flex flex-row justify-between" key={thing.name}>
                                    <div className="flex flex-row space-x-2">
                                        <div>{thing.name}</div>
                                        <button onClick={() => {
                                            editProductName(cnt);
                                        }} hidden={!props.editable}>
                                            <FontAwesomeIcon icon={faPencil} />
                                        </button>
                                    </div>
                                    <div className="flex flex-row items-center space-x-2">
                                        <div hidden={props.editable}>剩餘量：</div>
                                        <button className="bg-pink-300 rounded-lg aspect-square w-6"
                                            onClick={() => {
                                                toggleAmountChange(cnt, -1)
                                            }}
                                            hidden={!props.editable}>
                                            <FontAwesomeIcon icon={faMinus} />
                                        </button>
                                        <div className="bg-neutral-50 px-1">{thing.amount}</div>
                                        <button className="bg-red-300 rounded-lg aspect-square w-6"
                                            onClick={() => {
                                                toggleAmountChange(cnt, 1)
                                            }}
                                            hidden={!props.editable}>
                                            <FontAwesomeIcon icon={faPlus} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                        <div hidden={!props.editable}>
                            New Item
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    // page not exist in database

    useEffect(() => {
        setTimeout(() => {
            router.push("/")
        }, 3000)
    }, [])
    return (
        <div>
            Redirecting ...
            <div className="text-center">房間不存在</div>
        </div>
    )
}

import prisma from "../lib/prisma"


export async function getServerSideProps(context) {
    // TODO: Connect to databases
    /* TODO: Add authentication
        1. add a permanent token that can change single room
        2. add account system
     */
    // TODO: No websocket support yet
    // TODO: generate a token and send it to frontend to retrieve the item data?
    const roomNumber = context.params.number
    const token = context.query.token

    const result = await prisma.room.findFirst({
        where: { roomNumber }
    })

    if (result === null || result.status === "disabled") {
        // room not exist
        return {
            props: {
                props: {
                    exist: false
                }
            },
        }
    }
    // console.log(result.stuff)
    let username = undefined
    let editable = undefined

    if (token !== undefined) {
        // console.log("find user")
        const user = await prisma.user.findUnique({
            where: { token }
        })

        if (user !== null) {
            // user exist
            username = user.username
            // console.log(user.id)
            const getRooms = await prisma.user.findMany({
                where: {
                    token,
                    rooms: {
                        some: {
                            room: {
                                roomNumber
                            }
                        }
                    }
                }
            })
            console.log(getRooms)
            if (getRooms.length !== 0) {
                // verified
                editable = true
            }
            // console.log(getRooms)
        }

        // user is able to control this table
        //console.log(user.username)
    } else {
        console.log("token undefined")
    }
    return {
        props: {
            props: {
                token: token === undefined ? null : token,
                roomNumber,
                title: result.title,
                status: result.status,
                exist: true,
                username: username === undefined ? null : username,
                editable: editable === undefined ? null : editable,
            }
        },
    }
}