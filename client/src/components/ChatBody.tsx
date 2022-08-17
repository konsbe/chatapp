import React from "react";
import { useNavigate } from "react-router-dom";
import { Socket } from "socket.io-client";

const ChatBody = ({
  messages,
  lastMessageRef,
  typingStatus,
  socket,
}: {
  messages: any;
  lastMessageRef: any;
  typingStatus: any;
  socket: Socket;
}) => {
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({
    name: localStorage.getItem("userName"),
    id: localStorage.getItem("socketID"),
  });
  const handleLeaveChat = () => {
    localStorage.removeItem("userName");
    localStorage.removeItem("socketID");
    navigate("/");
    window.location.reload();
  };
  return (
    <>
      <header className="chat__mainHeader">
        <p>Hangout with Colleagues {userData.id}</p>
        <button className="leaveChat__btn" onClick={handleLeaveChat}>
          LEAVE CHAT
        </button>
      </header>

      <div className="message__container">
        {messages.map((message: any) =>
          message.name === localStorage.getItem("userName") ? (
            <div className="message__chats" key={message.id}>
              <p className="sender__name">You</p>
              <div className="message__sender">
                <p>{message.text}</p>
              </div>
              <p className="sender__name">{message.time}</p>
            </div>
          ) : (
            <div className="message__chats" key={message.id}>
              <p>{message.name}</p>
              <div className="message__recipient">
                <p>{message.text}</p>
              </div>
              <p className="sender__name">{message.time}</p>
            </div>
          )
        )}
        <div className="message__status">
          <p>{typingStatus}</p>
        </div>
        <div ref={lastMessageRef} />
      </div>
    </>
  );
};

export default ChatBody;
