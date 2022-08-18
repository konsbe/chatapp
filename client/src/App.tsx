import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import { io } from "socket.io-client";
// import socketIO from "socket.io-client";
import ChatPage from "./components/ChatPage";
const socket = io("ws://localhost:4001", {
  transports: ["websocket", "polling"],
});
function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/" element={<Home socket={socket} />}></Route>
          <Route path="/chat" element={<ChatPage socket={socket} />}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}
//
export default App;
