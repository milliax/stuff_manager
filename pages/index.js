import { useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch } from "@fortawesome/free-solid-svg-icons"
import Link from "next/link"
import Swal from "sweetalert2"

export default function Home() {
    const { inputRef } = useRef()

    const searchRooms = () => {
        Swal.fire({
            icon: "info",
            title: "Function Not Implemented Yet !!!"
        })
    }

    return (
        <div className="bg-neutral-50 h-screen">
            <div className="text-center pt-3 text-3xl">備品管理系統</div>
            <div className="text-right pr-2">Powered by Milliax</div>

            <div className="pt-10">
                <div className="flex flex-row justify-center">
                    <form className="bg-amber-50 w-1/2 rounded-full border-gray-500 border-2"
                        onSubmit={event => {
                            event.preventDefault();
                            searchRooms()
                        }}>
                        <input ref={inputRef}
                            className="bg-amber-50 w-[90%] h-10 rounded-full pl-5 outline-none"
                        />
                        <button>
                            <FontAwesomeIcon icon={faSearch} />
                        </button>
                    </form>
                </div>
                <div className="pt-10 flex flex-row justify-center">
                    <div className="md:w-1/2 w-4/5">
                        <div className="text-xl">快速房間連結</div>

                        <div className="py-5 grid md:grid-cols-3 grid-cols-1 gap-5">
                        {[{ dorm: "12", room: "619" }, { dorm: "10", room: "308" }, { dorm: "10", room: "319" }].map(bundle => (
                                <Link href={`${bundle.dorm}${bundle.room}`} key={`${bundle.dorm}${bundle.room}`} passHref>
                                    <div className="bg-blue-100 py-2 px-2 rounded-3xl flex flex-row w-36">
                                        <div className="px-5">
                                            {`${bundle.dorm}舍`}
                                        </div>
                                        <div>
                                            {bundle.room}
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
