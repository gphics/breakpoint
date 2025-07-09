import EditIconComponent from './EditIconComponent'
import { MdLockReset } from "react-icons/md";
function PasswordDisplayComponent() {
  return (
    <div className='user-sub-component'>
      <h4>Password</h4>
      <EditIconComponent subName='password' />
    </div>
  )
}

export default PasswordDisplayComponent