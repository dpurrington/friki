import { NextRequest, NextResponse } from 'next/server'
import { getLogger } from '../../../logging/log-util'
import { z } from 'zod'
import * as db from '../../../src/db'
import { Article } from '@/src/types'

export async function GET(request: NextRequest) {
  const logger = getLogger('main')
  logger.trace('get articles')
  logger.trace(request.url)
  return NextResponse.json(await db.getArticle('index'))
}

interface Body {
  id: string
  content: string
}
const schema = z.object({
  id: z.string().min(1),
  content: z.string(),
})

export async function POST(request: NextRequest) {
  try {
    const data = schema.parse(await request.json())
    return { statusCode: 201 }
  } catch (e) {
    const response: NextResponse = new NextResponse()
    return { statusCode: 400 }
  }
}
