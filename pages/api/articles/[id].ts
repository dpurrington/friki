import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import * as db from '@/src/db'
import { Article } from '@/src/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article>,
) {
  const { query, method } = req
  const id = query.id as string

  switch (method) {
    case 'GET':
      try {
        const article = await db.getArticle(id)
        res.status(200).json(article)
      } catch (e: any) {
        if (e.code === 'ENOENT') res.status(404).end()
        else {
          console.log(
            `Unexpected exception caught: ${e}. Returning 500 status code.`,
          )
          res.status(500).end()
        }
      }
      break
    default:
      res.setHeader('Allow', ['GET', 'PUT'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}

interface Body {
  id: string
  content: string
}
const schema = z.object({
  id: z.string().min(1),
  content: z.string(),
})
