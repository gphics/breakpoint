
import EditIconComponent from './EditIconComponent'

function ProfileComponent({ address, phone, country }) {
    return (
        <div className='user-sub-component'>
            <section>
                <div>
                    <h4>Address</h4>
                    <h3> {address} </h3>
                </div>
                <div>
                    <h4>  Phone </h4>
                    <h3> {phone} </h3>
                </div>
                <div>
                    <h4> Country </h4>
                    <h3> {country} </h3>
                </div>

            </section>

            <EditIconComponent subName='profile' />
        </div>
    )
}

export default ProfileComponent