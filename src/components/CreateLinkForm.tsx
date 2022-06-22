import { NextPage } from 'next'
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import classNames from 'classnames'

type Form = {
  slug: string
  url: string
}

export const CreateLinkForm: NextPage = ({}) => {
  const [form, setForm] = useState<Form>({ slug: '', url: '' })
  const url = window.location.origin

  const slugCheck = trpc.useQuery(['slugCheck', { slug: form.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  })

  const createSlug = trpc.useMutation(['createSlug'])

  const input =
    'text-black my-1 p-2 bg-white border shadow-sm border-slate-300 placeholder-slate-400 focus:outline-none focus:border-pink-500 focus:ring-pink-500 block w-full rounded-md sm:text-sm focus:ring-1'

  const slugInput = classNames(input, {
    'border-red-500': slugCheck.isFetched && slugCheck.data!.used,
    'text-red-500': slugCheck.isFetched && slugCheck.data!.used,
  })

  if (createSlug.status == 'success') return <>yeet</>

  return <>yeet</>
}

export default CreateLinkForm
