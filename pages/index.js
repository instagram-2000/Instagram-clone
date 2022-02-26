import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useRouter } from 'next/router'
import Link from 'next/link'
export default function Home() {
  const router = useRouter()
  const loginhandelr= () =>{
    router.push('/Login')
  }
  return (
    <>
   
      <Head>
        <title>Login ▫ Instagram</title>
        <meta name="description" content="Edited and modified by vaibhav And nagesh " />
        <link rel="icon" href="/insta.ico" />
      </Head>
      
     <div className="flex justify-center items-center my-40 text-4xl"><Link href='/Login'><h1 className="cursor-pointer text-blue-600 ">Login page touch me</h1></Link></div>
    
    </>


  )
}
