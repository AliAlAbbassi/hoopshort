import { NextPage } from 'next'
import { useState } from 'react'
import { trpc } from '../utils/trpc'
import classNames from 'classnames'
import debounce from 'lodash/debounce'
import { nanoid } from 'nanoid'
import copy from 'copy-to-clipboard'

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

  if (createSlug.status === 'success') {
    return (
      <>
        <div className='flex justify-center items-center'>
          <h1 className='truncate'>{`${url}/${form.slug}`}</h1>
          <input
            type='button'
            value='Copy Link'
            className='btn btn-active'
            onClick={() => {
              copy(`${url}/${form.slug}`)
            }}
          />
        </div>
        <input
          type='button'
          value='Reset'
          className='btn btn-active'
          onClick={() => {
            createSlug.reset()
            setForm({ slug: '', url: '' })
          }}
        />
      </>
    )
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        createSlug.mutate({ ...form })
      }}
      className='flex flex-col justify-center gap-5 text-lg mt-2 w-3/2 md:w-1/2 md:m-auto md:mt-5'
    >
      {slugCheck.data?.used && (
        <span className='font-medium mr-2 text-center text-red-500'>
          Slug already in use.
        </span>
      )}
      <input
        type='text'
        placeholder='URL'
        className='input text-xl m-auto w-full'
        onChange={(e) => {
          setForm({
            ...form,
            slug: e.target.value,
          })
          debounce(slugCheck.refetch, 100)
        }}
        value={form.slug}
        pattern={'^[-a-zA-Z0-9]+$'}
        title='Only alphanumeric characters and hypens are allowed. No spaces.'
        required
      />

      <input
        type='button'
        value='Random'
        className='btn btn-active'
        onClick={() => {
          const slug = nanoid()
          setForm({
            ...form,
            slug,
          })
          slugCheck.refetch()
        }}
      />
      <div className='flex items-center'>
        <span className='font-medium mr-2'>Link</span>
        <input
          type='url'
          onChange={(e) => setForm({ ...form, url: e.target.value })}
          placeholder='https://google.com'
          className='input text-xl w-full'
          required
        />
      </div>
      <input
        type='submit'
        value='Create'
        className='btn btn-active'
        disabled={slugCheck.isFetched && slugCheck.data!.used}
      />
    </form>
  )
}

export default CreateLinkForm
