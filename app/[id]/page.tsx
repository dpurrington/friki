export default function Page({ params }: { params: { id: string } }) {
  console.log(params)
  const title = 'Home'
  const id = params.id
  return (
    <div id="app">
      <div id="title">
        <span>Title: </span>
        {title}
      </div>
      <div>
        <span>Article Id: </span>
        {id}
      </div>
    </div>
  )
}
