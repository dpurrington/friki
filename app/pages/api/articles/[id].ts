import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import * as db from '../../../../src/db'
import { Article } from '@/src/types'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Article>,
) {
  console.log(`slug: ${req.query.slug}`)
  return res.status(200).json(await db.getArticle('index'))
}

interface Body {
  id: string
  content: string
}
const schema = z.object({
  id: z.string().min(1),
  content: z.string(),
})
