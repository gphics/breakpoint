import { FaEdit } from 'react-icons/fa'
import userContext from '@/app/dashboard/user/userContext'
import { useContext } from 'react'

function EditIconComponent({ subName = "password" }) {
    const { dispatch } = useContext(userContext)
    function toggleUserEditPage() {
        // email, profile, user,username, avatar, password
        dispatch({ type: "SET_SHOW_UPDATE_COMPONENT", payload: subName })
    }
    return (
        <p className='edit-icon-holder' >
            <FaEdit className='edit-icon' onClick={toggleUserEditPage} />
        </p>
    ) 
}

export default EditIconComponent