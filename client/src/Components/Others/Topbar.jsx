"use client"
import Image from "next/image"
import Link from "next/link"
import Logo from "../../../public/Assets/logo-3.svg"
import { usePathname } from "next/navigation"
function Topbar() {
    const pathname = usePathname()
    return (
        <div className="topbar">
            <Link className="home" href="/">
                <Image src={Logo} alt="breakpoint logo" />
            </Link>
            <div className="link-holder">
                 <Link className={`${pathname.includes("reg") ? "reg active" : "reg"}`} href="/auth/reg">Sign Up</Link>
                <Link
                    className={`${pathname.includes("log") ? "log active" : "log"}`}
                    href="/auth/log">Sign In</Link>
            </div>
        </div>
    )
}

export default Topbar