import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useRouter } from "next/router";
import Link from "next/link";
import {
  HomeIcon,
  ChatIcon,
  PlusCircleIcon,
  TemplateIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import ProfileDropdown from "./Profile/ProfileDropdown";
import Status from '../components/Profile/Status'
import Mainnavigation from "../components/Mainnavigation/Mainnavigation";
import Post from "../components/Home/Post";
import Suggestion from "../components/Home/Suggestion";
export default function Home() {
  const router = useRouter();
  const loginhandelr = () => {
    router.push("/Login");
  };

  return (
    <>
      <Head>
        <title>Instagram</title>
        <meta
          name="description"
          content="Edited and modified by Vaibhav And Nagesh "
        />
        <link rel="icon" href="/insta.ico" />
      </Head>
      <Mainnavigation></Mainnavigation>
      <div className="bg-gray-50 h-auto">
        <div class="grid grid-cols-3 gap-2 mx-44  mt-16 pt-8 ">
          <div class="col-span-2  space-y-8">
            <div className="flex flex-nowrap  items-center border bg-white px-1 py-1   space-x-6 overflow-hidden">

              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
              <Status></Status>
            </div>
            <div className="space-y-8">
              <div className="post"><Post></Post></div>
              <div className="post"><Post></Post></div>
              <div className="post"><Post></Post></div>
              <div className="post"><Post></Post></div>

            </div>




          </div>
          <div class=" mt-  h-[420px]">
            <div className="flex items-center mt-5   px-1">
              <div className="first mx-2 mt-2">
                <img
                  src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
                  className="rounded-full h-14 w-14 "
                  alt="Avatar"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-bold  text-sm">Mohanalkarvaibhav </span>
                <span className=" text-xs text-gray-500">vaibhav Mohanalkar</span>
              </div>
              <div className="flex flex-col ml-10 text-xs text-blue-700">
                <Link href="/" className="font-bold   text-blue-700 cursor-pointer">Switch</Link>

              </div>
            </div>
            <div className="flex   mt-5   px-1">
              <div className="">
                <span className=" text-sm text-gray-500">Suggestion for you </span>
              </div>
              <div className="">

                <span className=" text-xs ml-32">See All</span>
              </div>

            </div>
            <Suggestion/>
            <Suggestion/>
            <Suggestion/><Suggestion/>
            <Suggestion/>



          </div>
        </div>
      </div>
    </>
  );
}
