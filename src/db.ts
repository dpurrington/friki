import * as path from 'path'
import * as fs from 'node:fs/promises'
import { Article } from './types'
import * as process from 'process'

// TODO: figure out where this actually is post deployment
// or move it to an env var
const ARTICLE_DATA_PATH = `${__dirname}./articles`

function getArticlePath(id: string) {
  return path.join(process.env.data as string, 'articles', `${id}.md`)
}

export async function saveArticle(article: Article): Promise<void> {
  const fp = getArticlePath(article.id)
  return fs.writeFile(fp, 'utf-8')
}

export async function getArticle(articleId: string): Promise<Article> {
  const fp = getArticlePath(articleId)
  // NOTE: this a temporary persistence layer, reading a file
  // like this can be dangerous b/c you don't know how big the file is.
  const content = await fs.readFile(fp)
  return { id: articleId, content: content.toString('utf-8') }
}
