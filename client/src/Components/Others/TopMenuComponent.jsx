"use client"
import { MdMenu } from "react-icons/md"



function TopMenuComponent() {
  function btnClick(e) {
    const sidebar = document.querySelector(".sidebar")
    sidebar.classList.toggle("hide")
  }
  return (
    <div className='top-menu-component'>
      <MdMenu onClick={btnClick} className="menu-icon" />
    </div>
  )
}

export default TopMenuComponent