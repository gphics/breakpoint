
import "../../public/Styles/style.scss"
import NavigationHolder from "@/Components/Others/NavigationHolder";
import { ToastContainer } from "react-toastify";
export const metadata = {
  title: "Breakpoint",
  description : "A group discussion platform"
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ToastContainer position="top-center" autoClose={1500} theme="dark" />
        <NavigationHolder/>
        {children}
      </body>
    </html>
  );
}
