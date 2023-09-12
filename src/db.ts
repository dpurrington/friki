import * as path from 'path'
import * as fs from 'node:fs/promises'
import { Article } from './types'
import * as process from 'process'

function getArticlePath(id: string) {
  return path.join(process.env.data as string, 'articles', `${id}.json`)
}

export async function saveArticle(article: Article): Promise<void> {
  console.log('saving article')
  const fp = getArticlePath(article.id)
  return fs.writeFile(fp, JSON.stringify(article), 'utf-8')
}

export async function getArticle(articleId: string): Promise<Article | null> {
  const fp = getArticlePath(articleId)
  // NOTE: this a temporary persistence layer, reading a file
  // like this can be dangerous b/c you don't know how big the file is.
  // NOTE: we trust this location. If for some reason we change our minds about this,
  // we will have to be a lot more defensive here
  try {
    return JSON.parse((await fs.readFile(fp)).toString())
  } catch (e: any) {
    if (e.code === 'ENOENT') {
      return null
    }
    // TODO: this method of rethrowing loses stack info. Can it be done better?
    throw e
  }
}
