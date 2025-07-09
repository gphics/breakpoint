import Sidebar from "@/Components/Others/Sidebar"
import TopMenuComponent from "@/Components/Others/TopMenuComponent"

export const metadata = {
  title:"Breakpoint | Dashboard"
}

function layout({ children }) {
  return (
    <main className="main-content">
      <TopMenuComponent />
      <section className="children-holder">
        <Sidebar />
        {children}
      </section>

    </main>
  )
}

export default layout 