import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { logoutFromSystem } from "../../../redux/Service/auth/login";
import {
  getCookieByName,
  removeCookieByName,
  setCookieByName,
} from "../../../Utility/Helper";

/**
 * Dashboard Component
 * @returns {JSX.Element} JSX element representing the Dashboard component
 */

const Dashboard = (props) => {
  const navigate = useNavigate();
  const dispatch: AppDispatch = useDispatch();
  const callLogout = async () => {
    setTimeout(() => {
      removeCookieByName("token");
    }, 2000);
    await dispatch(logoutFromSystem());
  };

  const setCookie = () => {
    setCookieByName("name", "abc");
  };

  const getCookie = () => {
    console.log(getCookieByName("name"));
  };

  const removeCookie = () => {
    removeCookieByName("name");
  };
  return (
    <>
      <div className="text">Dashboard</div>
      <button
        onClick={() => {
          setTimeout(callLogout);
        }}
      >
        Logout
      </button>
      <button onClick={setCookie}>Set Cookie</button>
      <button onClick={getCookie}>Get Cookie</button>
      <button onClick={removeCookie}>Remove Cookie</button>
    </>
  );
};

export default Dashboard;
