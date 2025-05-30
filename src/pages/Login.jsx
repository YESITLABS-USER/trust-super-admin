import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/slices/adminSlice';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import CryptoJS from "crypto-js";
import AutoFillLogin from '../component/AutoFillLogin';

const Login = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const loggedInUser = localStorage.getItem("trust-superAdmin");
  // const { setFieldValue } = useFormikContext();


  useEffect(() => {
    if (loggedInUser) {
      setShowModal(true);
    }
  }, [loggedInUser]);

  const initialValues = {
    email: '',
    password: ''
  };

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const handleSubmit = (values) => {
    dispatch(login({ email: values.email, password: values.password }));
    const encryptedPassword = CryptoJS.AES.encrypt(values.password, "secretKey").toString();
    if (keepLoggedIn) {
      setCookie("email", values.email, 7);
      setCookie("password", encryptedPassword, 7);
    }
  };


  const setCookie = (name, value, days) => {
    const date = new Date();
    // date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
    date.setMonth(date.getMonth() + 1); // expires in 1 month
    document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
  };

  // useEffect(() => {
  //   const savedEmail = getCookie("email");
  //   const encryptedPassword = getCookie("password");
  //   console.log(savedEmail, encryptedPassword)
  //   if (savedEmail && encryptedPassword) {
  //     try {
  //       const decryptedPassword = CryptoJS.AES.decrypt(encryptedPassword, "secretKey").toString(CryptoJS.enc.Utf8);
  //       setKeepLoggedIn(true);
  //       // document.getElementById('login-email').value = savedEmail;
  //       document.getElementById('login-password').value = decryptedPassword;
  //       // setFieldValue("email", savedEmail);
  //       // setFieldValue("password", decryptedPassword);
  //       console.log(document.getElementById('#login-password') )
  //       // console.log("Decrypted Password:", decryptedPassword);
  //     } catch (error) {
  //       console.error("Error decrypting password:", error);
  //     }
  //   }
  // }, []);

  return (
    <>
      <div className="login-wrap">
        <div className="login-in">
          <div className="login-logo">
            <div className="logo">
              <img src="images/login-page/logo.svg" alt="Logo" />
            </div>
            <h1>Super Admin Login</h1>
          </div>
          <div className="login-form">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting,setFieldValue  }) => (
                <Form className="animate__animated animate__bounceIn">
                  <AutoFillLogin setFieldValue={setFieldValue } />
                  <h1>Super Admin Login</h1>
                  <hr />
                  <label className="login-lbl">
                    <img src="images/login-page/icons/email.svg" alt="Email Icon" />
                    <Field
                      id="login-email"
                      type="email"
                      name="email"
                      className="login-txt"
                      placeholder="Enter your Email here"
                    />
                  </label>
                  <ErrorMessage name="email" component="span" style={{ color: "red", fontSize: "12px" }} />

                  <label className="login-lbl mb-0">
                    <img src="images/login-page/icons/password.svg" alt="Password Icon" />
                    <Field
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="login-txt"
                      placeholder="Enter your Password"
                    />
                    <div className="password-eye" onClick={() => setShowPassword(!showPassword)}>
                      <i className="fas fa-eye-slash" id="eye"></i>
                    </div>
                  </label>
                  <ErrorMessage name="password" component="span" style={{ color: "red", fontSize: "12px" }} />

                  <div className="rembr-me">
                    <input
                      type="checkbox"
                      checked={keepLoggedIn}
                      onChange={(e) => setKeepLoggedIn(e.target.checked)}
                    /> Keep me logged in
                  </div>

                  <button type="submit" className="login-btn" disabled={loading}>
                    {loading ? "Loading..." : "Login"}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal animate__animated animate__bounceIn show"
          id="login-succ"
          tabIndex="-1"
          role="dialog"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}
          aria-modal="true"
        >
          <div className="modal-dialog" role="document">
            <div className="modal-content clearfix">
              <div className="modal-body">
                <div className="logout-in">
                  <h1>Login Successful</h1>
                  <img src="images/login-page/login-succ.svg" alt="Success" />
                  <p>Welcome to Admin panel!</p>
                  <button
                    className="logout-in-btn"
                    onClick={() => {
                      setShowModal(false);
                      navigate("/user-management");
                    }}
                  >
                    Okay
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
