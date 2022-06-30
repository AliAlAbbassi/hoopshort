import type { NextPage } from 'next'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const CreateLinkForm = dynamic(() => import('../components/CreateLinkForm'), {
  ssr: false,
})

const Home: NextPage = () => {
  return (
    <div className='flex flex-col h-screen w-screen justify-center'>
      <h1 className='text-5xl text-[#f0eff4] font-bold font-sans text-center'>
        HOOP SHORT
      </h1>
      <div className='mt-7 m-4 sm:m-20 sm:mt-5'>
        <Suspense>
          <CreateLinkForm />
        </Suspense>
      </div>
    </div>
  )
}

export default Home
