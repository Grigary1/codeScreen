// src/components/CodeEditor.jsx
import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { socket } from "../sockets/socket";
import { useParams } from "react-router-dom";

export default function CodeEditor() {
  const [code, setCode] = useState("// start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const { roomId } = useParams();
  const isRemote = useRef(false);

  // Assumes you store the current user id as a string in localStorage under "user"
  const id = localStorage.getItem("user");

  // Chat state
  const [chatMessages, setChatMessages] = useState([]); // each message: { id, clientId?, sender, senderId, message, timestamp, pending }
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // WPM tracking
  const [wpm, setWpm] = useState(0);
  const keystrokes = useRef(0);
  const startTime = useRef(null);

  // Line count
  const [lineCount, setLineCount] = useState(1);

  // helper to generate a clientId for optimistic messages
  const genClientId = () => `c_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  // Prevent accidental refresh loss
  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  // Join room and load saved code + socket listeners
  useEffect(() => {
    const saved = localStorage.getItem(`code-${roomId}`);
    if (saved) setCode(saved);

    // join-room with user id
    socket.emit("join-room", { roomId, userId: id });

    // handlers
    const onReceiveCode = (incoming) => {
      isRemote.current = true;
      if (typeof incoming === "string") {
        setCode(incoming);
        setLineCount(incoming.split("\n").length);
      }
    };

    // server sends: { message, sender, senderId, timestamp, clientId }
    const onReceiveChat = ({ message, sender, senderId, timestamp, clientId }) => {
      setChatMessages(prev => {
        // If clientId is present, try to find pending optimistic message and replace it
        if (clientId) {
          const idx = prev.findIndex(m => m.pending && m.clientId === clientId);
          if (idx !== -1) {
            const next = [...prev];
            next[idx] = {
              ...next[idx],
              sender: sender || next[idx].sender,
              senderId: senderId || next[idx].senderId,
              message,
              timestamp: timestamp || new Date().toISOString(),
              pending: false,
              clientId
            };
            return next;
          }
        }

        // No pending match -> append new server message
        return [
          ...prev,
          {
            id: `srv_${Date.now()}_${Math.floor(Math.random() * 100000)}`,
            clientId: clientId || null,
            sender,
            senderId,
            message,
            timestamp: timestamp || new Date().toISOString(),
            pending: false
          }
        ];
      });
    };

    socket.on("receive-code", onReceiveCode);
    socket.on("receive-chat", onReceiveChat);

    return () => {
      socket.off("receive-code", onReceiveCode);
      socket.off("receive-chat", onReceiveChat);
    };
  }, [roomId, id]);

  // Auto-scroll chat to bottom on new message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages]);

  // WPM calculation
  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime.current && keystrokes.current > 0) {
        const minutes = (Date.now() - startTime.current) / 60000;
        if (minutes > 0) {
          setWpm(Math.round((keystrokes.current / 5) / minutes));
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const onChange = (newValue) => {
    if (newValue === undefined) return;

    if (!startTime.current && newValue.length > 0) startTime.current = Date.now();

    // approximate keystrokes
    keystrokes.current += Math.abs(newValue.length - code.length);

    setLineCount(newValue.split("\n").length);

    if (!isRemote.current) {
      socket.emit("code-change", { roomId, code: newValue });
    } else {
      isRemote.current = false;
    }
    setCode(newValue);
  };

  const handleSave = () => {
    localStorage.setItem(`code-${roomId}`, code);
    alert("Code saved locally!");
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, code, language }),
      });
      const data = await response.json();
      alert(data.message || "Code submitted!");
    } catch (err) {
      alert("Submit failed");
    }
  };

  const handleRun = async () => {
    setOutput("Running...");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language }),
      });
      const data = await res.json();
      setOutput(data.output || data.message || "No output.");
    } catch (err) {
      setOutput(err.message);
    }
  };

  const copyRoomLink = () => {
    const fullLink = `${window.location.origin}/editor/${roomId}`;
    navigator.clipboard.writeText(fullLink);
    alert("Room link copied to clipboard!");
  };

  // Send chat: optimistic add (pending) + emit with clientId
  const sendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const clientId = genClientId();
    const now = new Date().toISOString();

    // optimistic pending message (sender shown as "You")
    setChatMessages(prev => [
      ...prev,
      {
        id: `tmp_${clientId}`,
        clientId,
        sender: "You",
        senderId: id,
        message: trimmed,
        timestamp: now,
        pending: true
      }
    ]);

    // emit to server (server will include clientId in echo)
    socket.emit("send-chat", { roomId, message: trimmed, clientId });

    setChatInput("");
  };

  // UI rendering
  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      {/* Left side - Code Editor */}
      <div style={{ flex: 3, display: "flex", flexDirection: "column" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem", background: "#222", color: "#fff" }}>
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="java">Java</option>
            <option value="cpp">C++</option>
            <option value="csharp">C#</option>
            <option value="typescript">TypeScript</option>
          </select>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button onClick={handleSave}>💾 Save</button>
            <button onClick={handleSubmit}>🚀 Submit</button>
            <button onClick={handleRun}>▶️ Run</button>
            <button onClick={copyRoomLink}>🔗 Copy Room Link</button>
          </div>
        </div>

        {/* Monaco Editor */}
        <Editor
          height="70vh"
          language={language}
          theme="vs-dark"
          value={code}
          onChange={onChange}
          options={{
            fontSize: 14,
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            wordWrap: "on",
          }}
        />

        {/* Output */}
        <div style={{ padding: "0.5rem", background: "#111", color: "#fff" }}>
          <h3>🔎 Output:</h3>
          <textarea
            value={output}
            readOnly
            style={{
              width: "100%",
              minHeight: "100px",
              fontFamily: "monospace",
              fontSize: "14px",
              padding: "10px",
              background: "#1e1e1e",
              color: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px"
            }}
          />
        </div>

        {/* Bottom Status Bar */}
        <div style={{
          padding: "0.5rem",
          background: "#333",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          fontSize: "14px"
        }}>
          <span>WPM: {wpm}</span>
          <span>Language: {language}</span>
          <span>Lines: {lineCount}</span>
        </div>
      </div>

      {/* Right side - Chat */}
      <div style={{
        flex: 1,
        borderLeft: "1px solid #444",
        display: "flex",
        flexDirection: "column",
        background: "#1e1e1e",
        color: "#fff",
        padding: 0
      }}>
        <h3 style={{ padding: "0.5rem", borderBottom: "1px solid #444", margin: 0 }}>💬 Chat</h3>

        {/* Chat messages */}
        <div style={{ flex: 1, padding: "0.75rem", overflowY: "auto" }}>
          {chatMessages.map((msg, idx) => {
            // msg: { clientId, sender, senderId, message, timestamp, pending }
            const isMe = String(msg.senderId) === String(id);
            return (
              <div key={msg.clientId || msg.id || idx} style={{ display: "flex", justifyContent: isMe ? "flex-end" : "flex-start", marginBottom: 10 }}>
                <div style={{
                  maxWidth: "80%",
                  padding: "8px 12px",
                  borderRadius: isMe ? "12px 12px 0 12px" : "12px 12px 12px 0",
                  background: isMe ? "#0b93f6" : "#e5e5ea",
                  color: isMe ? "#fff" : "#000",
                  textAlign: isMe ? "right" : "left",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                  opacity: msg.pending ? 0.7 : 1
                }}>
                  <div style={{ fontSize: 12, opacity: 0.85, marginBottom: 6 }}>
                    <strong>{isMe ? "You" : (msg.sender || "Unknown")}</strong>
                    {msg.pending && <span style={{ fontSize: 11, marginLeft: 8, opacity: 0.8 }}>sending…</span>}
                  </div>
                  <div style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.message}</div>
                  <div style={{ fontSize: 11, opacity: 0.6, marginTop: 6 }}>
                    {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ""}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div style={{ display: "flex", padding: "0.5rem", borderTop: "1px solid #444" }}>
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            placeholder="Type a message..."
            style={{ flex: 1, padding: "0.5rem", borderRadius: 4, border: "1px solid #555", background: "#111", color: "#fff" }}
            onKeyDown={(e) => { if (e.key === "Enter") sendChat(); }}
          />
          <button onClick={sendChat} style={{ padding: "0.5rem 0.75rem", marginLeft: 8 }}>Send</button>
        </div>
      </div>
    </div>
  );
}
