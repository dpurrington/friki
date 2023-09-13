export default function ArticleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="m-5">
      <section className="flex">
        <nav className="border-2 w-72 h-[85vh]">Nav content</nav>
        <div className="">{children}</div>
      </section>
      <div className="">Temp footer - this is where breadcrumbs will go</div>
    </div>
  )
}
