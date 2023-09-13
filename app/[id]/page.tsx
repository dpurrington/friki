import ReactMarkdown from 'react-markdown'
import { getArticle, saveArticle } from '../../src/db'
import Link from 'next/link'
import { redirect, notFound } from 'next/navigation'
import { Article } from '../../src/types'

// TODO: caching?
// TODO: concurrency support (timestamps)
export default async function Page(props: {
  params: { id: string }
  searchParams: any
}) {
  // This type casting is ridiculous. Not sure why it's giving a warning in TS
  // because both expressions appear to be of type Mode
  const mode: Mode =
    (Mode[props.searchParams.mode] as unknown as Mode) || Mode.View
  let article: Article | null = await getArticle(props.params.id)
  if (article === null) {
    if (mode === Mode.View) return notFound()

    article = {
      id: props.params.id,
      title: '',
      content: '',
    }
  }

  return (
    <div
      id="article"
      className="grid"
      style={{ gridTemplateColumns: '90% 10%' }}
    >
      <div id="title" className="text-3xl border-2">
        <h1 className="font-bold">{article.title}</h1>
      </div>
      <ControlButtons id={article.id} mode={mode} />
      <hr />
      <PageContent className="col-span-2" article={article} mode={mode} />
    </div>
  )
}

async function ControlButtons(props: { id: string; mode: Mode }) {
  return props.mode === Mode.Edit ? (
    <div></div>
  ) : (
    <div id="editLink">
      <Link className="btn" href={`/${props.id}?mode=Edit`}>
        Edit
      </Link>
    </div>
  )
}

async function PageContent(props: any) {
  async function update(formData: FormData) {
    'use server'
    const formValues: any = Object.fromEntries(formData)
    const updatedArticle: Article = {
      id: props.article.id,
      ...formValues,
    }
    await saveArticle(updatedArticle)
    console.log('redirecting')
    redirect(`/${props.article.id}`)
  }

  if (props.mode === Mode.Edit) {
    return (
      <div className="col-span-2">
        <form action={update}>
          <div>
            <input
              type="text"
              defaultValue={props.article.title}
              name="title"
              className="input input-bordered w-full max-w-xs"
            />
          </div>
          <textarea
            defaultValue={props.article.content}
            name="content"
            className="textarea textarea-bordered min-w-full h-[80vh] mt-2"
          />
          <EditingControlButtons id={props.article.id} />
        </form>
      </div>
    )
  }

  return (
    <div className="prose col-span-2">
      <ReactMarkdown>{props.article.content}</ReactMarkdown>
    </div>
  )
}

enum ButtonType {
  Edit,
  Save,
  Cancel,
}

enum Mode {
  View,
  Edit,
}

async function EditingControlButtons(props: { id: string }) {
  return (
    <div>
      <button className="btn m-1">Save</button>
      <Link className="btn m-1" href={`/${props.id}`}>
        Cancel
      </Link>
    </div>
  )
}
