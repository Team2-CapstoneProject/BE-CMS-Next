'use client'
import { useState } from "react";
import { useDispatch } from "react-redux";
// import { selectAuthState, setAuthState } from "../../redux/reducers/AuthReducer";
import { loginUser } from "../../redux/actions/AuthActions";
import { useRouter } from "next/navigation";
import "./Login.css";
// import { useNavigate } from "react-router-dom";
// import { wrapper } from "../store";

// export const getServerSideProps = wrapper.getServerSideProps(
//   (store) =>
//     async ({ params }) => {
//       // we can set the initial state from here
//       // we are setting to false but you can run your custom logic here
//       await store.dispatch(setAuthState(false)); 
//       console.log("State on server", store.getState());
//       return {
//         props: {
//           authState: false,
//         },
//       };
//     }
// );


const LoginPage = () => {
  const [credentials, setCredentials] = useState({
    loginType: "admin",
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const router = useRouter();

  const handleInputChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      dispatch(loginUser(credentials, router));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <section className="m-0 p-0 flex justify-center items-center">
      <div className="l-container">
        <div className="design">
          <div className="img-container">
            <div className="decoration">
              <img src="./ball.png" alt="decoration" />
            </div>
            <img
              src="./img-login.png"
              alt="login-img"
              className="bottom-center"
            />
          </div>
        </div>
        <div className="login">
          <div className="container">
            <div className="login-title">
              <h1>Login to Admin Page</h1>
              <p>See what is going on with your business</p>
            </div>
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Email
              </label>
              <input
                type="text"
                id="email"
                name="email"
                autoComplete="false"
                className="login-input"
                placeholder="Email"
                value={credentials.email}
                onChange={handleInputChange}
              />
            </div>
            <div className="login-field">
              <label className="login-label" htmlFor="email">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                autoComplete="false"
                className="login-input"
                placeholder="Password"
                value={credentials.password}
                onChange={handleInputChange}
              />
            </div>
            <button
              className="button-login"
              type="button"
              onClick={handleLogin}
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;