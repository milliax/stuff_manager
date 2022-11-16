import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMinus, faPencil, faPlus } from "@fortawesome/free-solid-svg-icons"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import {Swal} from "sweetalert2"

export default function AvailableStuff({ props }) {
    const [stuff, setStuff] = useState({
        "八寶粥": 8,
        "好吃的飯": 1
    })
    const router = useRouter()
    // console.log(props)

    const toggleAmountChange = (index, delta) => {
        // console.log(parseInt(stuff[index]) + delta)
        const newNumber = parseInt(stuff[index]) + delta
        setStuff({
            ...stuff,
            [index]: newNumber
        })
    }

    const editProductName = async (index) => {
 
    }

    useEffect(()=>{
        //TODO: fetch the latest stuff list

    },[])

    if (props.exist) {
        return (
            <div className="h-screen bg-neutral-50">
                <div className="text-center pt-3 text-3xl">{props.token}</div>
                <div className="text-right pr-2">Powered by Milliax</div>

                <div className="pt-5 flex flex-row justify-center">
                    <div className="w-1/2 flex flex-col space-y-3">
                        {Object.keys(stuff).map(index => (
                            <div className="bg-blue-100 rounded-full px-5 py-2 flex flex-row justify-between" key={index}>
                                <div className="flex flex-row space-x-2">
                                    <div>{index}</div>
                                    <button onClick={() => {
                                        editProductName(index);
                                    }}>
                                        <FontAwesomeIcon icon={faPencil} />
                                    </button>
                                </div>
                                <div className="flex flex-row items-center space-x-2">
                                    <button className="bg-pink-300 rounded-lg aspect-square w-6"
                                        onClick={() => {
                                            toggleAmountChange(index, -1)
                                        }}>
                                        <FontAwesomeIcon icon={faMinus} />
                                    </button>
                                    <div className="bg-neutral-50 px-1">{stuff[index]}</div>
                                    <button className="bg-red-300 rounded-lg aspect-square w-6"
                                        onClick={() => {
                                            toggleAmountChange(index, 1)
                                        }}>
                                        <FontAwesomeIcon icon={faPlus} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div>
                            New Item
                        </div>
                    </div>

                </div>
            </div>
        )
    }
    // page not exist in database
    router.push("/")

    return (
        <div>
            Redirecting ...
        </div>
    )
}

export async function getServerSideProps(context) {
    // TODO: Connect to databases
    /* TODO: Add authentication
        1. add a permanent token that can change single room
        2. add account system
     */
    // TODO: No websocket support yet
    const token = context.params.number
    return {
        props: {
            props: {
                token,
                exist: true
            }
        },
    }
}