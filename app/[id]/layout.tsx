export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      className="border-3 grid"
      style={{
        gridTemplateColumns: '20% 80%',
        gridTemplateRows: 'minmax(1700px, auto) 100px',
      }}
    >
      <div className="border-4 bg-slate-400">Nav content</div>
      <div className="bg-green-200">{children}</div>
      <div className="bg-blue-400 col-span-2">
        Temp footer - this is where breadcrumbs will go
      </div>
    </div>
  )
}
