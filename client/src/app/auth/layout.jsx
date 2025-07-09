import { ToastContainer } from "react-toastify"

export const metadata = {
    title: "Breakpoint|Auth"
}

export default function Layout({ children }) {
    return <>
        <ToastContainer position="top-center" autoClose={1500} theme="dark" />
        {children}
    </>
}