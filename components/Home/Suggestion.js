import React from 'react'
import Link from 'next/link'
const Suggestion = () => {
    return (
        <div className="flex items-center mt-5    px-1">
            <div className="first mx-2 ">
                <img
                    src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                    className="rounded-full h-8 w-8 "
                    alt="Avatar"
                />
            </div>
            <div className="flex flex-col">
                <span className="font-bold  text-sm">Mohanalkarvaibhav </span>
                <span className=" text-xs text-gray-500">vaibhav Mohanalkar</span>
            </div>
            <div className="flex flex-col ml-10 text-xs text-blue-700">
                <Link href="/" className="font-bold   text-blue-700 cursor-pointer">Follow</Link>

            </div>
        </div>
    )
}

export default Suggestion