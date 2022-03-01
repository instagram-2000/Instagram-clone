import React from 'react'
import Status from '../Profile/Status'
import Link from 'next/link';
import {
    HomeIcon,
    ChatIcon,
    PlusCircleIcon,
    TemplateIcon,
    HeartIcon,
} from "@heroicons/react/outline";
const Post = () => {
    return (
        <>
            <div className="border-gray  border  h-16 flex justify-center items-center bg-white"  >
                <div className="logo flex flex-row items-center  ">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                        className="rounded-full h-8 w-8 border-none ml-4"
                        alt="Avatar"
                    />



                </div>
                <span className='font-semibold ml-4 text-sm'>Mohanalkar Vaibhav </span>
                <div className="info ml-96 contrast-200 font-bold text-2xl flex items-center justify-center">
                    ...
                </div>
            </div>
            <div className="border-gray  border   flex items-center bg-white"  >
                <div className="logo flex flex-row items-center">
                    <img
                        src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                        className=" h-[600px] w-[640px] border-none "
                        alt="Avatar"
                    />


                </div>

            </div>
            <div className="    flex items-center bg-white"  >
                <div className="flex space-x-4 mt-4 mr-16 ">
                    <div className=""></div>
                    <div>
                        <Link href=""><ChatIcon className="h-7 w-7" /></Link>
                    </div>
                    <div>
                        <Link href=""><PlusCircleIcon className="h-7 w-7" /></Link>
                    </div>
                    <div>
                        <Link href=""><TemplateIcon className="h-7 w-7" /></Link>
                    </div>


                </div>
                <div className="info ml-96 contrast-200 font-bold text-2xl flex items-center justify-center">
                    ...
                </div>

            </div>
            <div className="border-gray  border-b   flex  items-center bg-white"  >
                <div className="flex flex-col space-x-2 mt-4 mr-16 space-y-1">
                    
                    <div>
                        <span className='font-bold'>16456 likes</span>
                    </div>
                    <div>
                        <span><span className="font-bold">technoruhez</span> Barcelona Me Dhamaal 💫</span>

                    </div>
                    <div className='font-thin tex-xs'>
                    ... more
                    </div>
                    <div className='font-thin tex-xs'>
                    View all 7 comments
                    </div>
                    <div className='font-thin text-xs'>
                    8 HOURS AGO
                    </div>
                </div>




            </div>
            <div className="  border flex  h-14 bg-white     ">
              <div className="emoji text-4xl flex ml-4">☺</div>
              <input className='mx-2' type="text" placeholder='Add a comment ' />
              <div className="flex space-x-2 ml-72 justify-center items-center">
                <div className="media">Media</div>
                <div className="like">heart</div>
              </div>
            </div>
        </>
    );
}

export default Post;