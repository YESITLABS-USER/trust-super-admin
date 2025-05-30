import React from 'react'
import { useNavigate } from 'react-router-dom';

const LogoutModal = () => {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem("trust-superAdmin");
        navigate("/")
    }

  return (
    <div className="modal fade" id="logout" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel">
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
                            <img src="images/menu-icons/logout-icon.svg" alt="" />
                        </div>
                        <p>Are you sure you want to logout?</p>
                        <div className="all-commonbtns-popup">
                            <a style={{cursor:"pointer", color:"white"}} onClick={handleLogout} data-bs-dismiss="modal" aria-label="Close">Yes</a>
                            <a style={{cursor:"pointer", color:"white"}}  data-bs-dismiss="modal" aria-label="Close">Cancel</a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</div>
  )
}

export default LogoutModal
