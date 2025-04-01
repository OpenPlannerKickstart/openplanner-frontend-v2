
// import React, { useEffect, useState, createContext, ReactChild } from "react";
// import { useSelector, useDispatch, connect } from "react-redux";
// import SockJS from "sockjs-client";
// import { over } from "stompjs";
// import {
//   getWebSocketFailure,
//   getWebSocketSuccess,
// } from "../redux/generic/generic.action";
// import { WEB_SOCKET_CONNECTION_URL } from "../Utility/Config";
// import { RootState } from "../redux/store";
// import { getToken, isEmptyObjectOrNullUndefiend, isNullUndefinedOrBlank } from '../Utility/Helper';

// // const webSocket = new WebSocket("ws://api.shkdiamond.com:8081/auctionwebsocket");
// const socket = new SockJS(WEB_SOCKET_CONNECTION_URL);
// const stompClient = over(socket);
// // const onConnect = () => {
// //   const socket = new SockJS(WEB_SOCKET_CONNECTION_URL);
// //    stompClient = over(socket);
// // }

// export const SocketContext = createContext(stompClient);

// interface ISocketProvider {
//   children: React.ReactChild;
// }
// const SocketProvider = (props) => {
//   const SOCKET_RECONNECTION_TIMEOUT = 10;
//   const [ws, setWs] = useState<any>(stompClient);
//   const isAuthenticated = getToken() !== null ? true : false;
//   // const products = useSelector((state) => state);
//   // const dispatch = useDispatch();
//   console.log(stompClient, "socket");
//   // console.log("connected in ")
//   // console.log("connected in: ",  !isNullUndefinedOrBlank(getToken()));

//   useEffect(() => {
//     // const onClose = () => {
//     //   setTimeout(() => {
//     //     setWs(over(socket));
//     //     // console.log(over(socket), "socket onClose");
//     //   }, SOCKET_RECONNECTION_TIMEOUT);
//     // };

//     // socket.onopen = function () {
//     //   console.log("open");
//     // };
//     console.log(isAuthenticated, "ws Connected")
//     if (isAuthenticated) {
//       // console.log(over(socket), "ws Connected");
//       // ws.connect(
//       //   {});
//       // onConnect();
//       // if (!ws) {
//       // setWs(over(socket));
//       // stompClient.connect({})
//       // }
//     }
//     else {
//       if (!ws) {
//         // onDeactivate();
//       }
//     }


//     // console.log("connected in ")
//     // if (isAuthenticated) {
//     //   // ws.connect({});
//     //   ws.connect(
//     //     {},

//     //     (frame) => {

//     //       props.getWebSocketSuccess(true);
//     //       console.log("Connection Opend");

//     //       console.log(frame, "ws Connected");
//     //       console.log(over(socket), "ws Connected");
//     //       // setWs(over(socket));

//     //       //  else {
//     //       //   props.getWebSocketFailure(false);

//     //       // }

//     //       // ws.send("/notification/socketTest");
//     //       // ws.subscribe('/topic/socketTestRes', (msg) => {
//     //       //   console.log("SUBSCRIBED SUCCESSFULLY", msg.body);
//     //       //   //you can execute any function here
//     //       // });
//     //     },
//     //     // () => {
//     //     //   onClose();
//     //     // }
//     //   );
//     // }
//     // else {
//     //   // console.log("Connected: ", !isNullUndefinedOrBlank(getToken()));
//     //   console.log("connected in ",ws);
//     //   // ws.
//     //   // if(isEmptyObjectOrNullUndefiend(ws)){

//     //     onDeactivate();
//     //   // }
//     //   // socket.onclose = () => {
//     //   //   console.log("Connection Closed");
//     //   //   console.log(ws, "socket");
//     //   //   ws.disconnect(() => {

//     //   //     props.getWebSocketFailure(false);
//     //   //   });

//     //   //   // ws.deactivate();
//     //   //   onClose();
//     //   // };
//     // }


//   }, [ws, isAuthenticated]);

//   const onDeactivate = () => {
//     console.log("deactivate", ws);
//     // if (!isAuthenticated) {
//     // ws.deactivate();
//     // stompClient.disconnect((frame) => {
//     //   console.log(frame);
//     //   setWs(null);
//     //   // props.getWebSocketFailure(false);
//     // });
//     // socket.onclose = () => {
//     //   console.log("Connection Closed");
//     //   console.log(ws, "socket");


//     //   // ws.deactivate();
//     //   // onClose();
//     //   console.log("deactivate");
//     // };
//   }

//   // }
//   return (
//     <SocketContext.Provider value={ws}>
//       {props.children}
//     </SocketContext.Provider>
//   );
// };


// const mapStateToProps = (state: RootState) => {
//   return { appReducer: state.appReducer };
// };

// const mapDispatchToProps = {
//   getWebSocketSuccess,
//   getWebSocketFailure

// };
// export default connect(mapStateToProps, mapDispatchToProps)(SocketProvider);