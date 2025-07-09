import { NextResponse } from "next/server"


const unprotectedRoutes = ["/", "/auth/reg", "/auth/log"]
function middleware(request) {
    const { pathname } = request.nextUrl
    const authToken = request.cookies.get("auth")
    // if auth token is available and the nexturl is an unprotected route
    if (unprotectedRoutes.includes(pathname) && authToken) {
        const dashboard = new URL("/dashboard", request.url)
        return NextResponse.redirect(dashboard)
    }
    if (pathname.includes("dashboard") && !authToken) {
        return NextResponse.redirect(new URL("/", request.url))
    }
    NextResponse.next()
}

export default middleware