import React from "react";
import LoaderLogo from "/assets/images/sidebar-logo-sm.svg";
import "./Loader.scss";
/**
 * Loader component
 * @param {Object} props - Props for Loader component
 * @param {boolean} props.loading - Flag indicating whether to display the loader or not
 */
function Loader({ loading }: any) {
  return (
    <>
      {/* {loading && (
        <div className="loader-container">
          <svg className="inner-container" viewBox="0 0 35 35" height="35" width="35">
            <rect
              className="track"
              x="2.5"
              y="2.5"
              fill="none"
              stroke-width="5px"
              width="32.5"
              height="32.5"
            />
            <rect
              className="car"
              x="2.5"
              y="2.5"
              fill="none"
              stroke-width="5px"
              width="32.5"
              height="32.5"
              pathLength="100"
            />
          </svg>
        </div>
      )} */}
    </>
  );
}

export default Loader;

Loader.defaultProps = {
  loading: false,
};
