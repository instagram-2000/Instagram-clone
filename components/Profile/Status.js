import React from 'react'

const Status = () => {
  return (
   <div className='flex flex-col '>
    <div className="border-2 border-red-700 flex justify-center items-center px-0.5 h-16 w-16 rounded-full">
    <img
              src="https://mdbcdn.b-cdn.net/img/new/avatars/2.webp"
              className="rounded-full  "
              alt="Avatar"
            />
    </div>
      <span className="flex justify-center"> status</span>      
   </div>
  )
}

export default Status