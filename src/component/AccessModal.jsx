import React from "react";
import { getAllFirms, updateFirmsAccess } from "../redux/slices/adminSlice";
import { useDispatch } from "react-redux";

const AccessModal = (updateStatus) => {
  const dispatch = useDispatch();

  console.log("checkdataaaaa", updateStatus?.updateStatus);
  const newStatus = updateStatus?.updateStatus?.access_status;
  const id = updateStatus?.updateStatus?.id;
  const handlleUpdateStatus = async () => {
    // const { id, access_status } = updateStatus.updateStatus;
    await dispatch(updateFirmsAccess({ id: id, access_status: newStatus }));
    await dispatch(getAllFirms());
  };
  return (
    <div
      className="modal fade"
      id="suspend-popup"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="myModalLabel"
    >
      <div className="modal-dialog big-modal-common" role="document">
        <div className="modal-content clearfix">
          <div className="modal-heading">
            <button
              type="button"
              className="close close-btn-front"
              data-bs-dismiss="modal"
              aria-label="Close"
            >
              <img src="images/menu-icons/close-popup-icon.svg" alt="" />
            </button>
          </div>
          <div className="modal-body">
            <div className="logout-pop-wrap">
              <form>
                <div className="logout-img-wrap">
                  <img
                    src={
                      newStatus == "granted"
                        ? "images/menu-icons/actiavte-popup-icon.svg"
                        : "images/menu-icons/suspend-opup-icon.svg"
                    }
                    alt=""
                  />
                </div>
                <p>
                  Are you sure you want to
                  <br />
                  {newStatus == "granted" ? "grant" : "denied"} access to the
                  user?
                </p>
                <div className="all-commonbtns-popup">
                  <a href="#" data-bs-dismiss="modal" aria-label="Close">
                    Cancel
                  </a>
                  <a
                    href="#"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                    onClick={() => handlleUpdateStatus()}
                  >
                    Yes
                  </a>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccessModal;
