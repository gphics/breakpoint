import AuthStorage from "@/utils/cookieStorage"
import Link from "next/link"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { GrGroup } from "react-icons/gr";

function CommunityListComponent({ setIsLoading }) {
  const api = `${process.env.NEXT_PUBLIC_SERVER_URL}/community/`
  const [myCommunities, setMyCommunities] = useState(null)
  const authToken = new AuthStorage().getAuth()
  async function fetchMyCommunities() {

    try {
      setIsLoading(true)
      const first = await fetch(api, { method: "GET", headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
      const second = await first.json()
      setIsLoading(false)
      const { data, err } = second
      if (err) {
        toast.error(err.msg)
        return
      }
      const communityArr = data.msg
      if (!communityArr.length) {
        setMyCommunities(null)

      } else {
        const arr = communityArr.map(({ name, description, id, avatar }) => ({ name, id, description, avatar }))
        await fetchUserPosition(arr)
      }

    } catch (error) {
      setIsLoading(false)
      toast.error(error.message)
    }

  }
  async function fetchUserPosition(arr) {
    const first = arr.map(async elem => {
      const { id } = elem
      const completeUrl = api + `user-position?id=${id}`
      try {
        setIsLoading(true)
        const first = await fetch(completeUrl, { method: "GET", headers: { "Authorization": `Token ${authToken}`, "Content-Type": "application/json" } })
        const second = await first.json()
        setIsLoading(false)
        const { err, data } = second
        if (err) {
          toast.error(err.msg)
          return
        }
        const { position } = data.msg
        return { ...elem, position }
      } catch (error) {
        setIsLoading(false)
        toast.error(error.message)
      }
    })
    const second = await Promise.allSettled(first)
    const res = second.map(({ value }) => value)
    setMyCommunities(res)
  }
  useEffect(() => { fetchMyCommunities() }, [])
  return (
    <div className="community-list-component">
      {!myCommunities ? <h3>No community</h3> : myCommunities.map(({ name, description, id, position, avatar }, index) => {
        const desc = description.length > 30 ? description.slice(0, 30) +" ...":description
        return <Link href={`/dashboard/community/${id}?name=${name}`} key={index} className="each-community">
          {avatar ? <></> : <section className="rep-holder">
            <GrGroup className="rep-icon" />
          </section>}
          <h4>{name}</h4>
          <p>{desc}</p>
          <small>{position}</small>
        </Link>
      })}
    </div>
  )
}

export default CommunityListComponent