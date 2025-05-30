import React from 'react'
import { getAllFirms, updateSuspendStatus } from '../redux/slices/adminSlice'
import { useDispatch } from 'react-redux'

const ActivateModal = (updateStatus) => {
    const dispatch = useDispatch();
    const handlleUpdateStatus = async() => {
        console.log(updateStatus.updateStatus)
        const { id, status } = updateStatus.updateStatus
        const newStatus = status === "active" ? "inactive" : "active";

        await dispatch(updateSuspendStatus({ id: id, suspend_status: newStatus }));
        await dispatch(getAllFirms())
        
    }

    return (
        <div className="modal fade" id="actiavte-popup" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
            <div className="modal-dialog big-modal-common" role="document">
                <div className="modal-content clearfix">
                    <div className="modal-heading">
                        <button type="button" className="close close-btn-front" data-bs-dismiss="modal" aria-label="Close">
                            <img src="images/menu-icons/close-popup-icon.svg" alt="" />
                        </button>
                    </div>
                    <div className="modal-body">
                        <div className="logout-pop-wrap">
                            <form>
                                <div className="logout-img-wrap">
                                    <img src="images/menu-icons/actiavte-popup-icon.svg" alt="" />
                                </div>
                                <p>Are you sure you want to <br />
                                    Activate User ?</p>
                                <div className="all-commonbtns-popup">
                                    <a href="#" data-bs-dismiss="modal" aria-label="Close">Cancel</a>
                                    <a href="#" data-bs-dismiss="modal" aria-label="Close" onClick={handlleUpdateStatus}>Yes</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ActivateModal
