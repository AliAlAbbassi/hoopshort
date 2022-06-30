import * as trpc from '@trpc/server'
import * as trpcNext from '@trpc/server/adapters/next'
import { string, number, z } from 'zod'
import { prisma } from '../../../db/client'

const appRouter = trpc
  .router()
  .query('slugCheck', {
    input: z.object({
      slug: z.string(),
    }),
    async resolve({ input }) {
      const count = await prisma?.shortLink.count({
        where: {
          slug: input.slug,
        },
      })

      return { used: count! > 0 }
    },
  })
  .mutation('createSlug', {
    // validate input with Zod
    input: z.object({
      slug: z.string(),
      url: z.string(),
    }),
    async resolve({ input }) {
      try {
        await prisma?.shortLink.create({
          data: {
            slug: input.slug,
            url: input.url,
          },
        })
      } catch (error) {
        console.log(error)
      }
    },
  })

export type AppRouter = typeof appRouter

export default trpcNext.createNextApiHandler({
  router: appRouter,
  createContext: () => null,
})
