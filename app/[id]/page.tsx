import ReactMarkdown from 'react-markdown'
import { getArticle, saveArticle } from '../../src/db'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { Article } from '../../src/types'

// TODO: this needs refactoring into components
// TODO: caching?
// TODO: concurrency support (timestamps)
export default async function Page(props: {
  params: { id: string }
  searchParams: any
}) {
  const mode = props.searchParams.mode
  switch (mode) {
    case 'edit':
    case 'save':
      return EditPage(props)
    default:
      return ViewPage(props)
  }
}

async function ViewPage({ params }: { params: { id: string } }) {
  const article = await getArticle(params.id)
  if (article === null) return notFound()

  return (
    <div id="app">
      <div id="title" className="article-title">
        <h1>{article.title}</h1>
      </div>
      <ReactMarkdown>{article.content}</ReactMarkdown>
      <Link href={`/${params.id}?mode=edit`}>Edit</Link>
    </div>
  )
}

async function EditPage({ params }: { params: { id: string } }) {
  // use the article, or a blank one if it does not exist
  let article = (await getArticle(params.id)) || {
    id: params.id,
    title: '',
    content: '',
  }

  async function update(formData: FormData) {
    'use server'
    const formValues: any = Object.fromEntries(formData)
    const updatedArticle: Article = {
      id: params.id,
      ...formValues,
    }
    await saveArticle(updatedArticle)
    redirect(`/${params.id}`)
  }

  return (
    <div id="app">
      <div id="title" className="article-title">
        <h1>{article.title}</h1>
      </div>
      <form action={update}>
        <div>
        <input type="text" defaultValue={article.title} name="title" />
        </div>
        <textarea
          defaultValue={article.content}
          name="content"
          className="max-w-xs"
          rows={80}
          cols={120}
        />
        <div>
        <input type="submit" value="Save" />
        </div>
      </form>
      <ReactMarkdown>{article.content}</ReactMarkdown>
      <a href={`/${params.id}`}>Cancel Changes</a>
    </div>
  )
}
