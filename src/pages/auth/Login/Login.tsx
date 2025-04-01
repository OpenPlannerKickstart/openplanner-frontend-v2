import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { loginToSystem } from "../../../redux/Service/auth/login";
import { setCookieByName } from "../../../Utility/Helper";

/**
 * Login Component
 * @param {object} props - Props passed to the component
 * @returns {JSX.Element} JSX element representing the Login component
 */

const Login = (props) => {
  const dispatch: AppDispatch = useDispatch();
  const callLogin = async () => {
    setTimeout(() => {
      setCookieByName("token", "hii");
    }, 2000);
    await dispatch(loginToSystem());
  };

  return (
    <>
      <div className="text">Login</div>
      <button onClick={callLogin}>login</button>
    </>
  );
};
export default Login;
