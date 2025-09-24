import React, { useState } from "react";
import Sidebar from "../components/chat/Sidebar";
import ChatHeader from "../components/chat/ChatHeader";
import Thread from "../components/chat/Thread";
import Composer from "../components/chat/Composer";

/**
 * PUBLIC_INTERFACE
 * Chat
 * Main chat page layout composed of Sidebar, ChatHeader, Thread area, and Composer.
 * No demo pills or static AI responses are rendered.
 */
export default function Chat() {
  const [value, setValue] = useState("");

  const handleSend = () => {
    // placeholder handler; integration will be wired later
    setValue("");
  };

  const handleUpload = (_files) => {
    // placeholder for upload initiation
  };

  return (
    <div
      className="bg-canvas"
      style={{
        display: "grid",
        gridTemplateColumns: "300px 1fr",
        height: "calc(100vh - 56px)", // account for existing NavBar height area
      }}
    >
      <Sidebar />
      <section
        className="relative"
        style={{
          display: "grid",
          gridTemplateRows: "auto 1fr auto",
          height: "100%",
        }}
        aria-label="Main chat area"
      >
        <ChatHeader />
        <Thread>
          {/* Intentionally no static messages */}
        </Thread>
        <Composer
          value={value}
          onChange={setValue}
          onSend={handleSend}
          onUpload={handleUpload}
        />
      </section>
    </div>
  );
}
