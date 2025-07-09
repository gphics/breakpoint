"use client"
import Topbar from "./Topbar"
import { usePathname } from "next/navigation"

function NavigationHolder() {
    const pathname = usePathname()
    const isProtected = pathname.includes("dashboard")
    
    return <>
    {isProtected ? "": <Topbar/>}
    </>
}

export default NavigationHolder