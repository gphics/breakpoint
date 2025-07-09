
import Img from "../../public/Assets/landing page img.svg"
import Image from "next/image"
import Link from "next/link"

export default function Home() {
  return <main className="landing-page">
    <section className="first">
      <h3>Real-time</h3>
      <h3>Engagement For</h3>
      <h3>Your Community</h3>
      <p>Exquisite way to get your message across a community.</p>
      <Link href="/auth/reg">Get Started</Link>
    </section>
    <section className="second">
      <Image alt="landing page image" src={Img} />
    </section>

  </main>
}
