
import EditIconComponent from './EditIconComponent'
function UsernameComponent({ username }) {
    return (
        <div className='user-sub-component'>

            <section>
                <div>
                    <h4>Username</h4>
                    <h3>{username}</h3>
                </div>
               
            </section>
            <EditIconComponent subName='username' />
        </div>
    )
}

export default UsernameComponent