import Image from 'next/image'
import EditIconComponent from './EditIconComponent'
import Avatar from "../../../public/Assets/default-user-img.png"

function AvatarComponent({ avatar }) {
  return (
    <div className='user-sub-component'>
      {avatar ? <></> : <Image className='user-avatar' src={Avatar} alt="user image"/> }
      <EditIconComponent subName='avatar' />
    </div>
  )
}

export default AvatarComponent