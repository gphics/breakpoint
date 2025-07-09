// ToastContainer is only in the MembersComponent
const { default: AddMemberComponent } = require("./AddMemberComponent")
const { default: CommunityAdminsComponent } = require("./CommunityAdminsComponent")
const { default: CommunityMembersComponent } = require("./CommunityMembersComponent")
import Link from "next/link"
import CommunityAvatarComponent from "./CommunityAvatarComponent";
import CommunityNameComponent from "./CommunityNameComponent";
import CommunityDescriptionComponent from "./CommunityDescriptionComponent";
import CommunityButtonComponent from "./CommunityButtonComponent";

async function fetchAuthUserPosition(authToken, id) {
  try {
    const api = `${process.env.SERVER_URL}community/user-position?id=${id}`
    const first = await fetch(api, { headers: { "Authorization": `Token ${authToken}` } })
    const second = await first.json()
    return second
  } catch (error) {
    return { data: null, err: { msg: error.message } }
  }
}

export default async function CommuityDetailComponent({ data, authToken }) {
  const { name, created_at, description, avatar, id, founder, admins, members , is_active} = data
  const { err, data: info } = await fetchAuthUserPosition(authToken, id)
  const adminsLength = admins?.length
  const membersLength = members?.length
  const totalLength = membersLength + adminsLength
  // This is use to determine if the auth user is an admin of the community
  let isAdmin = false
  if (!err) {
    
    const { position } = info.msg
    switch (position) {
      case "member":
        break; 
      default:
        isAdmin = true;
    }

  }
  return <div className="community-detail-component">
    <header>
      <CommunityAvatarComponent avatar={avatar} isAdmin={isAdmin} />
      <CommunityNameComponent communityId={id} authToken={authToken} name={name} isAdmin={isAdmin} />
      <CommunityDescriptionComponent authToken={authToken} communityId={id} description={description} isAdmin={isAdmin} />

      <Link href={`/dashboard/user/${founder.id}`}>Owner:  {founder.username}</Link>
      <br />
      <small> {is_active ? "Active":"Inactive"} </small>
      <small> Created at {new Date(created_at).toDateString()} </small>
      <CommunityButtonComponent isActive={is_active} isAdmin={isAdmin} communityId={id} authToken={authToken} />
    </header>
    <AddMemberComponent isAdmin={isAdmin} authToken={authToken} communityId={id} memberLength={totalLength} />
    <CommunityAdminsComponent communityId={id} isAdmin={isAdmin} />
    <CommunityMembersComponent communityId={id} isAdmin={isAdmin} />
  </div>
}
