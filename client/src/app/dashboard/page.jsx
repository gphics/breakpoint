"use client"
import CommunityCreateComponent from "@/Components/dashboard/CommunityCreateComponent"
import CommunityListComponent from "@/Components/dashboard/CommunityListComponent"
import LoadingComponent from "@/Components/Others/LoadingComponent"
import {  useState } from "react"
import { FaPlus } from "react-icons/fa"
import { ToastContainer } from "react-toastify"

function DashboardPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [toggleCreateModal, setToggleCreateModal] = useState(false)
    return (
        <div className='content-holder dashboard-page'>
            <ToastContainer position="top-center" autoClose={1000} />
            {isLoading && <LoadingComponent />}
            <header>
                <h3>My Communities</h3>
                <button type='button' onClick={() => { setToggleCreateModal(!toggleCreateModal) }}>  <FaPlus /></button>
            </header>
            {toggleCreateModal && <CommunityCreateComponent toggleHandler={setToggleCreateModal} setIsLoading={setIsLoading} />}
          
            <CommunityListComponent setIsLoading={setIsLoading}/>
        </div>
    )
}

export default DashboardPage