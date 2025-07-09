"use client"
import { FaEdit } from "react-icons/fa"
import { GrGroup } from "react-icons/gr";
function CommunityAvatarComponent({ avatar, isAdmin }) {
    return (avatar ? <section className="rep-holder advance">

        {isAdmin && <FaEdit className="edit-icon" />}
    </section> : <section className="rep-holder advance">
        <GrGroup className="rep-icon" />
        {isAdmin && <FaEdit className="edit-icon" />}
    </section>)

}

export default CommunityAvatarComponent