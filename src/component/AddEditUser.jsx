import { useFormik } from "formik";
import { useState } from "react";
import { useDispatch } from "react-redux";
import * as Yup from "yup";
import { addFirms, getAllFirms, updateFirm } from "../redux/slices/adminSlice";

const AddEditUser = ({ editData }) => {
  const dispatch = useDispatch();
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: editData?.name || "",
      email: editData?.email || "",
      phone: editData?.phone || "",
      subscription_type: editData?.subscription_type || "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Name is required"),
      email: Yup.string().email("Invalid email").required("Email is required"),
      phone: Yup.string().required("Phone is required"),
      subscription_type: Yup.string().required("Subscription type is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        if (editData) {
          setLoading(true);
          await dispatch(updateFirm({ id: editData.id, ...values }));
          setLoading(false);
        } else {
          setLoading(true);
          await dispatch(addFirms(values));
          setLoading(false);
        }
        await dispatch(getAllFirms());
        resetForm();
        setIsSubmit(true);
        // Close the modal manually
        const modal = document.getElementById('create-newuser-popup');
        if (modal) {
          const bootstrapModal = bootstrap.Modal.getInstance(modal);
          bootstrapModal?.hide();
        }
      } catch (error) {
        console.error("Error submitting:", error);
      }
    },
    enableReinitialize: true,
  });

  return (
    <div
      className="modal fade"
      id="create-newuser-popup"
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
            <div className="common-form-wrap">
              <form onSubmit={formik.handleSubmit}>
                <div className="common-pop-warp">
                  <h3 className="">{editData ? "Edit" : "Add"}</h3>
                  <div className="creat-new-user-wrap">
                    <div className="col-lg-12">
                      <div className="row">
                        <div className="col-lg-6">
                          <label>
                            <h3>Name</h3>
                            <input
                              type="text"
                              name="name"
                              placeholder="Enter name"
                              value={formik.values.name}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.name && formik.errors.name && (
                              <div className="text-danger">
                                {formik.errors.name}
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="col-lg-6">
                          <label>
                            <h3>Email</h3>
                            <input
                              type="text"
                              name="email"
                              placeholder="Enter Email"
                              value={formik.values.email}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.email && formik.errors.email && (
                              <div className="text-danger">
                                {formik.errors.email}
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="col-lg-6">
                          <label>
                            <h3>Phone</h3>
                            <input
                              type="text"
                              name="phone"
                              placeholder="Enter Phone"
                              value={formik.values.phone}
                              onChange={formik.handleChange}
                            />
                            {formik.touched.phone && formik.errors.phone && (
                              <div className="text-danger">
                                {formik.errors.phone}
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="col-lg-6">
                          <label>
                            <h3>Subscription Type</h3>
                            <select
                              name="subscription_type"
                              value={formik.values.subscription_type}
                              onChange={formik.handleChange}
                            >
                              <option value="">Select Subscription</option>
                              <option value="basic">Basic</option>
                              <option value="premium">Premium</option>
                            </select>
                            {formik.touched.subscription_type && formik.errors.subscription_type && (
                              <div className="text-danger">
                                {formik.errors.subscription_type}
                              </div>
                            )}
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="big-modal-common-btns">
                      <button
                        type="submit"
                        style={{
                          borderRadius: "30px",
                          color: "#fff",
                          textAlign: "center",
                          padding: "10px 43px",
                          backgroundColor: "#000429",
                          fontSize: "15px",
                          width: "auto",
                          fontWeight: 400,
                        }}
                        className="big-modal-common-btns"
                      >
                        {loading ? 'Saving...' : (editData ? "Update" : "Save")}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddEditUser;



// import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { addFirms, getAllFirms, updateFirm } from "../redux/slices/adminSlice";

// const AddEditUser = ({ editData = null }) => {
//   const dispatch = useDispatch();
//   const initialFormData = {
//     name: "",
//     email: "",
//     phone: "",
//     role: "",
//   };
//   console.log("checstateDAtaa", editData);

//   const [formData, setFormData] = useState(initialFormData);
//   useEffect(() => {
//     if (editData) {
//       setFormData({
//         name: editData.name || "",
//         email: editData.email || "",
//         phone: editData.phone || "",
//         role: editData.assign_role || "",
//         id: editData.id || "",
//       });
//     }
//   }, [editData]);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value,
//     }));
//   };
//   const handleSubmit = async () => {
//     const { name, email, phone, role, id } = formData;
//     if (!name || !email || !phone || !role) {
//       alert("Please fill all fields.");
//       return;
//     }
//     try {
//       editData
//         ? await dispatch(updateFirm({ id, ...formData }))
//         : await dispatch(addFirms(formData));
//       await dispatch(getAllFirms());
//       setFormData(initialFormData);
//     } catch (error) {
//       console.error("Error submitting:", error);
//     }
//   };

//   return (
//     <>
//       <div
//         className="modal fade"
//         id="create-newuser-popup"
//         tabIndex="-1"
//         role="dialog"
//         aria-labelledby="myModalLabel"
//       >
//         <div className="modal-dialog big-modal-common" role="document">
//           <div className="modal-content clearfix">
//             <div className="modal-heading">
//               <button
//                 type="button"
//                 className="close close-btn-front"
//                 data-bs-dismiss="modal"
//                 aria-label="Close"
//               >
//                 <img src="images/menu-icons/close-popup-icon.svg" alt="" />
//               </button>
//             </div>
//             <div className="modal-body">
//               <div className="common-form-wrap">
//                 <form action="">
//                   <div className="common-pop-warp">
//                     <h3 className="">{editData ? "Edit" : "Add"}</h3>
//                     <div className="creat-new-user-wrap">
//                       <div className="col-lg-12">
//                         <div className="row">
//                           <div className="col-lg-6">
//                             <label>
//                               <h3>Name</h3>
//                               <input
//                                 type="text"
//                                 name="name"
//                                 placeholder="Enter name"
//                                 value={formData.name}
//                                 onChange={handleChange}
//                               />
//                             </label>
//                           </div>
//                           <div className="col-lg-6">
//                             <label>
//                               <h3>Email</h3>
//                               <input
//                                 type="text"
//                                 placeholder="Enter Email"
//                                 name="email"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                               />
//                             </label>
//                           </div>
//                           <div className="col-lg-6">
//                             <label>
//                               <h3>Phone</h3>
//                               <input
//                                 type="text"
//                                 placeholder="Enter Phone"
//                                 name="phone"
//                                 value={formData.phone}
//                                 onChange={handleChange}
//                               />
//                             </label>
//                           </div>
//                           <div className="col-lg-6">
//                             <label>
//                               <h3>Assign role</h3>
//                               <select
//                                 id=""
//                                 name="role"
//                                 value={formData.role}
//                                 onChange={handleChange}
//                               >
//                                 <option value="">Select role</option>
//                                 <option value="admin">Admin</option>
//                                 <option value="superadmin">SuperAdmin</option>
//                                 <option value="administrator">
//                                   Administrator
//                                 </option>
//                                 <option value="attorney">Attorney</option>
//                                 <option value="accountant">Accountant</option>
//                                 <option value="user">User</option>
//                               </select>
//                             </label>
//                           </div>
//                         </div>
//                       </div>

//                       <div className="big-modal-common-btns">
//                         <a
//                           href="#"
//                           data-bs-dismiss="modal"
//                           onClick={handleSubmit}
//                         >
//                           {editData ? "Update" : "Save"}
//                         </a>
//                       </div>
//                     </div>
//                   </div>
//                 </form>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default AddEditUser;
