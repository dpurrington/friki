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
    <div id="article">
      <div id="articleHeader" className="border-2 w-[75vw]">
        <div id="title" className="text-3xl inline-block border-2">
          <h1 className="font-bold">{article.title}</h1>
        </div>
        <ControlButtons id={article.id} mode={mode} />
        <hr />
      </div>
      <PageContent article={article} mode={mode} />
    </div>
  )
}

async function ControlButtons(props: { id: string; mode: Mode }) {
  return (
    <div className="flex justify-end border-2">
      <div id="editLink">
        <Link className="btn" href={`/${props.id}?mode=Edit`}>
          Edit
        </Link>
      </div>
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
      <div>
        <form action={update}>
          <div>
            <input
              type="text"
              defaultValue={props.article.title}
              name="title"
            />
          </div>
          <textarea
            defaultValue={props.article.content}
            name="content"
            className="textarea textarea-bordered w-[78vw] h-[80vh] p-3"
          />
          <EditingControlButtons id={props.article.id} />
        </form>
      </div>
    )
  }

  return (
    <div className="prose">
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

function classForButton(buttonType: ButtonType, mode: Mode) {
  // this list should be exhaustive
  switch (buttonType) {
    case ButtonType.Edit:
      return mode === Mode.View ? '' : 'hidden'
    case ButtonType.Save:
    case ButtonType.Cancel:
      return mode === Mode.Edit ? '' : 'hidden'
    default:
      throw `Unexpected button type encountered: ${buttonType}`
  }
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
