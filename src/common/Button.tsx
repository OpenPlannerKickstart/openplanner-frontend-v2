import React from "react";
import "./button.scss";
import PropTypes from "prop-types";
import { ButtonProps } from "../interfaces";

/**
 * Button component
 * Renders a button element with optional icon, text, and onClick handler.
 * @param {Object} props - Props for Button component
 * @param {string} [props.className] - Additional classes for the button
 * @param {boolean} [props.disabled] - Flag indicating if the button should be disabled
 * @param {JSX.Element} [props.icon] - Icon element to display within the button
 * @param {string} [props.text] - Text to display within the button
 * @param {string} [props.type] - Type of the button (e.g., "button", "submit")
 * @param {Function} [props.onClick] - Function to call when the button is clicked
 * @param {JSX.Element} [props.children] - Child elements to render within the button
 */
const Button = (props: ButtonProps) => {
  // console.log(props?.text, props.disabled);

  return (
    <div className=" ">
      <button
        onClick={props.onClick}
        className={`btn ${props?.className}`}
        disabled={props.disabled}
        type={props?.type}
      >
        {props.icon ? props.icon : ""}
        {props?.children}
        {props?.text}
      </button>
    </div>
  );
};

export default Button;

Button.prototype = {
  text: PropTypes.string,
  onClick: PropTypes.any,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  type: PropTypes.string,
  icon: PropTypes.any,
};

Button.defaultProps = {
  text: "",
  type: "button",
  className:"",
  icon: "",
  disabled: false,
};
