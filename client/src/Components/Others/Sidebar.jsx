"use client"
import { FaHome, FaPowerOff } from "react-icons/fa"
import { FaMessage, FaUser } from "react-icons/fa6"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { MdOutlineArrowBack } from "react-icons/md"
import AuthStorage from "@/utils/cookieStorage"


function Sidebar() {
  const router = useRouter()
  const pathname = usePathname()
  const linkArr = [
    { Icon: MdOutlineArrowBack, url: "#", action: () => router.back() , title:"Back"},
    { Icon: FaHome, url: "/dashboard" , title:"Dashboard" },
    { Icon: FaMessage, url: "/dashboard/dm" , title:"DM" },
    { Icon: FaUser, url: "/dashboard/user" , title:"User" },
    {
      Icon: FaPowerOff, url: "#",  title: "Logout", action: () => {
        new AuthStorage().deleteAuth()
        router.replace("/")
      }
    },
  ]
  return (
    <div className="sidebar hide">
      {linkArr.map(({ url, Icon, action, title }, index) => <Link title={title} className={`${pathname === url ? "side-link active" : "side-link"}`} href={url} key={index} onClick={(e) => action()}> <Icon /> </Link>)}
    </div>
  )
}

export default Sidebar