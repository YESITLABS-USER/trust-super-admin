import React from 'react'
import { deleteFirm, getAllFirms } from '../redux/slices/adminSlice'
import { useDispatch } from 'react-redux'

const DeleteModal = ({ deletedId }) => {
    const dispatch = useDispatch()
    const deleteHandler = async () => {
        await dispatch(deleteFirm(deletedId));
        await dispatch(getAllFirms())
    }

    return (
        <div className="modal fade" id="delete-popup" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
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
                                    <img src="images/menu-icons/delete-popup-icon.svg" alt="" />
                                </div>
                                <p>Are you sure you want to Delete?</p>
                                <div className="all-commonbtns-popup">
                                    <a href="#" data-bs-dismiss="modal" aria-label="Close">Cancel</a>
                                    <a href="#" data-bs-dismiss="modal" aria-label="Close" onClick={deleteHandler}>Delete</a>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeleteModal
