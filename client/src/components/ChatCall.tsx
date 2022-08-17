import React, { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import Peer, { SignalData } from "simple-peer";

interface IProps {
  me: string;
  stream: MediaStream | undefined;
  receivingCall: boolean;
  caller: string;
  callerSignal: string;
  callAccepted: boolean;
  idToCall: string;
  callEnded: boolean;
  name: string;
}

const INITIAL_DATA = {
  me: "",
  stream: undefined,
  receivingCall: false,
  caller: "",
  callerSignal: "",
  callAccepted: false,
  idToCall: "",
  callEnded: false,
  name: "",
};

const ChatCall = ({ socket }: { socket: Socket }) => {
  const [callData, setCallData] = useState<IProps>(INITIAL_DATA);
  const [userName, setUserName] = useState<any>("unknown");
  const myVideo = React.useRef<any>("");
  const userVideo = React.useRef<any>();
  const connectionRef = React.useRef<any>();
  //sends the username and socket ID to the Node.js server
  useEffect(() => {
    if (localStorage.getItem("userName")) {
      setUserName(localStorage.getItem("userName"));
      // socket.emit("newUser", { userName, socketID: socket.id });
    } else {
      setUserName("unknown");
    }
    console.log(userName);
  }, [userName]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setCallData({ ...callData, stream: stream });
        myVideo.current.srcObject = stream;
      });

    socket.on("me", (id) => {
      setCallData({ ...callData, me: id });
    });

    socket.on("callUser", (data) => {
      setCallData({
        ...callData,
        receivingCall: true,
        caller: data.from,
        callerSignal: data.signal,
        name: data.name,
      });
    });
    socket.on("closeConnection", (data) => {
      setCallData({ ...callData, callEnded: true });
      // window.location.reload();

      connectionRef.current.destroy();
    });
  }, [callData, socket]);

  const callUser = (id: any) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: callData.stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signalData: data,
        from: callData.me,
        name: callData.name,
      });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });
    socket.on("callAccepted", (signal) => {
      setCallData({ ...callData, callAccepted: true });

      peer.signal(signal);
    });

    connectionRef.current = peer;
  };
  console.log("connectionRef.current: ", connectionRef.current);
  const answerCall = () => {
    setCallData({ ...callData, callAccepted: true });
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: callData.stream,
    });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: callData.caller });
    });
    peer.on("stream", (stream) => {
      userVideo.current.srcObject = stream;
    });

    peer.signal(callData.callerSignal);
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallData({
      ...callData,
      callEnded: true,
      receivingCall: false,
      callAccepted: false,
    });
    const peer = new Peer({
      initiator: true,
      trickle: true,
      stream: undefined,
    });
    peer.on("signal", () => {
      socket.emit("closeConnection");
    });

    // connectionRef.current.destroy();
    // window.location.reload();
    console.log("connectionRef: ", connectionRef);
    console.log("socket: ", socket);
  };

  return (
    <div className="chat__sidebar">
      <h2 style={{ float: "right", marginBottom: "3rem" }}>Call Room</h2>
      <div>
        {/* <h4 className="chat__header">ACTIVE USERS</h4> */}
        <div className="chat_bar_container">
          <label htmlFor="username" style={{ marginBottom: "1rem" }}>
            User Name
          </label>
          <input
            type="text"
            minLength={6}
            name="username"
            id="username"
            className="username__input"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            style={{ marginBottom: "1rem" }}
          />
          <label htmlFor="username" style={{ marginBottom: "1rem" }}>
            User ID to Call
          </label>
          <input
            type="text"
            id="filled-basic"
            className="username__input"
            value={callData.idToCall}
            onChange={(e) =>
              setCallData({ ...callData, idToCall: e.target.value })
            }
          />
          <div className="call-button">
            <div className="call-button">
              {callData.callAccepted && !callData.callEnded ? (
                <></>
              ) : (
                <button
                  color="primary"
                  aria-label="call"
                  onClick={() => callUser(callData.idToCall)}
                  className="home__cta"
                  style={{ marginBottom: "1rem", marginTop: "1rem" }}
                >
                  Call
                </button>
              )}
              {callData.callAccepted && (
                <button
                  style={{ backgroundColor: "red", marginTop: "20px" }}
                  onClick={leaveCall}
                  aria-label="call"
                  className="home__cta"
                >
                  End Call
                </button>
              )}
              {callData.idToCall}
            </div>
          </div>
        </div>
      </div>
      <div className="video-container">
        <div className="video">
          {callData.stream && (
            <video
              playsInline
              muted
              ref={myVideo}
              autoPlay
              style={{ width: "300px" }}
            />
          )}
        </div>
        <div className="video">
          {callData.callAccepted && !callData.callEnded ? (
            <video
              playsInline
              ref={userVideo}
              autoPlay
              style={{ width: "300px" }}
            />
          ) : null}
        </div>
      </div>
      <div>
        {callData.receivingCall && !callData.callAccepted ? (
          <div className="caller">
            <h1>{callData.name} is calling...</h1>
            <button
              style={{ backgroundColor: "green", marginTop: "20px" }}
              color="primary"
              onClick={answerCall}
              className="home__cta"
            >
              Answer
            </button>
            <button
              style={{ backgroundColor: "red", marginTop: "20px" }}
              onClick={leaveCall}
              aria-label="call"
              className="home__cta"
            >
              End Call
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ChatCall;
