import React from 'react'
import { MdOutlineStar } from "react-icons/md";
import PageHeader from '../components/header/PageHeader';

const Review = () => {
  return (
    <div className='flex flex-col w-full py-12'>
        <PageHeader title="Reviews"  />
        <div className='flex items-center justify-around mb-10'>
        <div className='h-[16vw]  w-[25vw] bg-gray-100 rounded-2xl py-8 flex flex-col items-center justify-between'>
 <div className='flex  items-center justify-center'>
 <MdOutlineStar size={28} color='#032c6a'/>
 <MdOutlineStar size={28} color='#032c6a' />
 <MdOutlineStar size={28} color='#032c6a' />
 <MdOutlineStar size={28} color='#032c6a' />
 </div>
 <p className='px-6 text-center text-md italic'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam aut itaque nemo? Quam distinctio nisi fugiat. Hic quod iure eos?</p>
     <h3>@Dammy</h3>
        </div>
           <div className='h-[16vw]  w-[25vw] bg-gray-100 rounded-2xl py-8 flex flex-col items-center justify-between'>
 <div className='flex  items-center justify-center'>
 <MdOutlineStar size={28} color='#032c6a'/>
 <MdOutlineStar size={28} color='#032c6a' />
 <MdOutlineStar size={28} color='#032c6a' />
 <MdOutlineStar size={28} color='#032c6a' />
 </div>
 <p className='px-6 text-center text-md italic'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam aut itaque nemo? Quam distinctio nisi fugiat. Hic quod iure eos?</p>
     <h3>@Dammy</h3>
        </div>
         <div className='h-[16vw]  w-[25vw] bg-gray-100 rounded-2xl py-8 flex flex-col items-center justify-between'>
 <div className='flex  items-center justify-center'>
 <MdOutlineStar size={28} color='#032c6a'/>
 <MdOutlineStar size={28} color='#032c6a' />
 <MdOutlineStar size={28} color='#032c6a' />
 <MdOutlineStar size={28} color='#032c6a' />
 </div>
 <p className='px-6 text-center text-md italic'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Numquam aut itaque nemo? Quam distinctio nisi fugiat. Hic quod iure eos?</p>
     <h3>@Dammy</h3>
        </div>
        
    </div>
    </div>
  )
}

export default Review