import CommuityDetailComponent from "@/Components/community/CommunityDetailComponent";
import { cookies } from "next/headers"


async function fetchSingleCommunity(authToken, id) {
  try {
    const api = `${process.env.SERVER_URL}community/single?id=${id}`
    const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
    const second = await first.json()
    return second
  } catch (error) {
    return { data: null, err: { msg: error.message } }
  }
}


async function CommunityPage({ params }) {
  const store = await cookies()
  const { value: authToken } = store.get("auth")
  const { id } = await params
  const { data, err } = await fetchSingleCommunity(authToken, id)

  return (
    <div className='content-holder single-commmunity-page'>
      {err && <h3 className="err-h">{err?.msg}</h3>}
      {data && <CommuityDetailComponent data={data.msg} authToken={authToken} />}
    </div>
  )
}



export default CommunityPage