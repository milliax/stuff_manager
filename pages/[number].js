import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"
import { useEffect, useState, useRef } from "react"
import Swal from "sweetalert2"
import Link from "next/link"

export default function AvailableStuff({ props }) {
    const [loading, setLoading] = useState(true)
    const [newItem, setNewItem] = useState(false)
    const [stuff, setStuff] = useState({})
    const newItemNameRef = useRef()
    const newItemValueRef = useRef()
    const router = useRouter()

    const toggleAmountChange = async (index, delta) => {
        // console.log(parseInt(stuff[index]) + delta)
        console.log(index)
        const newNumber = parseInt(stuff[index].amount) + delta
        console.log(newNumber)
        if (newNumber === 0) {
            const result = await Swal.fire({
                title: `${stuff[index].name}吃/用完了嗎 ?`,
                icon: "question"
            })
            if (!result.isConfirmed) {
                console.log("don't delete")
                return;
            }

        }
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

    const editProductName = async (index) => {
        const result = await Swal.fire({
            title: "輸入要修改成的名稱",
            input: "text",
            text: `原本名稱：${stuff[index].name}`,
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
                        name: newName,
                        id: stuff[index].id
                    })
                }).then(response => {
                    if (!response.ok) {
                        throw new Error(response.statusText)
                    }
                    return response.json()
                }).then(() => {
                    updateStuff()
                }).catch(error => {
                    Swal.showValidationMessage(`Request failed: ${error}`)
                })
            },
            allowOutsideClick: () => !Swal.isLoading()
        })

        if (result.isConfirmed) {
            return Swal.fire({
                title: `更新成功`,
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

    const createNewItem = async () => {
        const name = newItemNameRef.current.value
        const value = newItemValueRef.current.value

        try {
            const res = await fetch(`/api/create`, {
                method: "POST",
                body: JSON.stringify({
                    token: props.token,
                    roomId: props.roomId,
                    name,
                    value
                })
            })
            const json = await res.json();
            if (!res.ok) {
                await Swal.fire({
                    title: json.error,
                    icon: "error"
                })
            }
        } catch (err) {
            console.log(`Error: ${err}`)
        }
        setNewItem(false)
        newItemNameRef.current.value = "";
        newItemValueRef.current.value = 0;
        updateStuff();
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

                        <div hidden={!props.editable}
                            className="bg-red-100 w-24 text-center py-1 rounded-full cursor-pointer hover:bg-red-200 hover:shadow-md"
                            onClick={() => {
                                setNewItem(!newItem)
                            }}>
                            New Item
                        </div>
                        <form className={`bg-red-100 px-5 py-2 rounded-xl ${newItem ? "flex flex-col" : "hidden"} space-y-3`}
                            onSubmit={event => {
                                event.preventDefault();
                                createNewItem();
                            }}>
                            <div className="flex flex-row w-full justify-between">
                                <div className="w-2/5 flex flex-row">
                                    <div className="w-20">品名</div>
                                    <input ref={newItemNameRef}
                                        className="w-full rounded-lg px-2" />
                                </div>
                                <div className="w-1/5 flex flex-row">
                                    <div className="w-20">數量</div>
                                    <input ref={newItemValueRef}
                                        className="w-full rounded-lg px-2"
                                        type="number"
                                    />
                                </div>
                            </div>
                            <button className="self-end bg-blue-100 px-2 py-0.5 rounded-full hover:shadow-lg hover:bg-blue-200">新增</button>
                        </form>
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
    // TODO: No websocket support yet
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
    let roomId = undefined
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
                    AND: [
                        { token },
                        {
                            rooms: {
                                some: {
                                    roomNumber
                                }
                            }
                        }
                    ]
                },
                include: {
                    rooms: []
                }
            })
            console.log(getRooms)
            if (getRooms.length !== 0) {
                // verified
                editable = true
                roomId = result.id
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
                roomId: roomId === undefined ? null : roomId,
            }
        },
    }
}