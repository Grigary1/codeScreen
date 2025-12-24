import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { socket } from "../sockets/socket";
import { useParams } from "react-router-dom";

export default function CodeEditor() {
  const [code, setCode] = useState("// start coding...");
  const [language, setLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [running, setRunning] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { roomId } = useParams();
  const isRemote = useRef(false);

  const id = localStorage.getItem("user");

  // Chat state
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState("");
  const chatEndRef = useRef(null);

  // WPM tracking
  const [wpm, setWpm] = useState(0);
  const keystrokes = useRef(0);
  const startTime = useRef(null);

  // Line count
  const [lineCount, setLineCount] = useState(1);

  // UI flashes
  const [toast, setToast] = useState(null);
  const toastRef = useRef(null);

  // per-action loading
  const [copying, setCopying] = useState(false);

  const genClientId = () => `c_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  useEffect(() => {
    const unloadCallback = (event) => {
      event.preventDefault();
      event.returnValue = "";
      return "";
    };
    window.addEventListener("beforeunload", unloadCallback);
    return () => window.removeEventListener("beforeunload", unloadCallback);
  }, []);

  // sockets + load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`code-${roomId}`);
    if (saved) setCode(saved);

    socket.emit("join-room", { roomId, userId: id });

    const onReceiveCode = (incoming) => {
      isRemote.current = true;
      if (typeof incoming === "string") {
        setCode(incoming);
        setLineCount(incoming.split("\n").length);
        flashToast("Code updated by collaborator");
      }
    };

    const onReceiveChat = ({ message, sender, senderId, timestamp, clientId }) => {
      setChatMessages((prev) => {
        if (clientId) {
          const idx = prev.findIndex((m) => m.pending && m.clientId === clientId);
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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (startTime.current && keystrokes.current > 0) {
        const minutes = (Date.now() - startTime.current) / 60000;
        if (minutes > 0) setWpm(Math.round((keystrokes.current / 5) / minutes));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const onChange = (newValue) => {
    if (newValue === undefined) return;

    if (!startTime.current && newValue.length > 0) startTime.current = Date.now();

    keystrokes.current += Math.abs(newValue.length - code.length);
    setLineCount(newValue.split("\n").length);

    if (!isRemote.current) socket.emit("code-change", { roomId, code: newValue });
    else isRemote.current = false;

    setCode(newValue);
  };

  const handleSave = () => {
    localStorage.setItem(`code-${roomId}`, code);
    flashToast("Saved locally");
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, code, language })
      });
      const data = await response.json();
      flashToast(data.message || "Submitted");
    } catch (err) {
      flashToast("Submit failed", "error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRun = async () => {
    setRunning(true);
    setOutput("");
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language })
      });
      const data = await res.json();
      setOutput(data.output || data.message || "No output.");
    } catch (err) {
      setOutput(err.message || "Run failed");
    } finally {
      setRunning(false);
    }
  };

  const copyRoomLink = async () => {
    try {
      setCopying(true);
      const fullLink = `${window.location.origin}/editor/${roomId}`;
      await navigator.clipboard.writeText(fullLink);
      flashToast("Room link copied");
    } catch (err) {
      flashToast("Copy failed", "error");
    } finally {
      setCopying(false);
    }
  };

  const genClient = () => `tmp_${Math.random().toString(36).slice(2, 9)}`;

  const sendChat = () => {
    const trimmed = chatInput.trim();
    if (!trimmed) return;

    const clientId = genClientId();
    const now = new Date().toISOString();

    setChatMessages((prev) => [
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

    socket.emit("send-chat", { roomId, message: trimmed, clientId });
    setChatInput("");
  };

  const flashToast = (message, type = "info", ms = 3000) => {
    setToast({ message, type });
    clearTimeout(toastRef.current);
    toastRef.current = setTimeout(() => setToast(null), ms);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      {/* Left - Editor area */}
      <div className="flex-1 flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-800 bg-gradient-to-r from-slate-800 via-slate-900 to-slate-800">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold">Editor</div>
            <select
              aria-label="Select language"
              className="text-sm rounded-md px-2 py-1 bg-white text-black"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="csharp">C#</option>
              <option value="typescript">TypeScript</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-sm"
              title="Save locally"
            >
              💾 Save
            </button>

            <button
              onClick={handleSubmit}
              className={`px-3 py-1 rounded-md text-sm ${submitting ? 'bg-indigo-600/70 cursor-not-allowed' : 'bg-indigo-600'}`}
              disabled={submitting}
            >
              {submitting ? 'Submitting…' : '🚀 Submit'}
            </button>

            <button
              onClick={handleRun}
              className={`px-3 py-1 rounded-md text-sm ${running ? 'bg-emerald-600/70 cursor-not-allowed' : 'bg-emerald-600'}`}
              disabled={running}
            >
              {running ? 'Running…' : '▶️ Run'}
            </button>

            <button
              onClick={copyRoomLink}
              className="px-3 py-1 rounded-md bg-white/5 hover:bg-white/10 text-sm"
              title="Copy room link"
            >
              {copying ? 'Copying…' : '🔗 Share'}
            </button>
          </div>
        </div>

        {/* Editor */}
        <div className="flex-1 overflow-hidden">
          <Editor
            height="calc(100vh - 220px)"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={onChange}
            options={{ fontSize: 14, minimap: { enabled: false }, scrollBeyondLastLine: false, wordWrap: "on" }}
          />
        </div>

        {/* Output & status */}
        <div className="px-4 py-3 border-t border-gray-800 bg-gray-800">
          <div className="flex items-start gap-4">
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-300 mb-1">Output</div>
              <pre className="bg-black/60 text-sm p-3 rounded max-h-44 overflow-auto font-mono text-white whitespace-pre-wrap">{output || <span className="text-gray-500">No output yet</span>}</pre>
            </div>

            <div className="w-48 text-sm text-gray-400">
              <div className="mb-2">WPM: <span className="font-medium text-white ml-1">{wpm}</span></div>
              <div className="mb-2">Lines: <span className="font-medium text-white ml-1">{lineCount}</span></div>
              <div>Language: <span className="font-medium text-white ml-1">{language}</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Chat */}
      <aside className="w-96 border-l border-gray-800 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col">
        <div className="px-4 py-3 flex items-center justify-between border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 w-8 h-8 rounded flex items-center justify-center font-bold">C</div>
            <div>
              <div className="text-sm font-semibold">Room Chat</div>
              <div className="text-xs text-gray-500">Collaborate & coordinate</div>
            </div>
          </div>
          <div className="text-xs text-gray-500">{chatMessages.length} messages</div>
        </div>

        <div className="flex-1 overflow-auto p-4 space-y-3">
          {chatMessages.map((msg, idx) => {
            const isMe = String(msg.senderId) === String(id);
            return (
              <div key={msg.clientId || msg.id || idx} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[78%] p-3 rounded-lg ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white/5 text-gray-100 rounded-bl-none'}`}>
                  <div className="text-xs opacity-80 mb-1 font-medium">{isMe ? 'You' : (msg.sender || 'Unknown')}</div>
                  <div className={`whitespace-pre-wrap text-sm ${msg.pending ? 'opacity-80 italic' : ''}`}>{msg.message}</div>
                  <div className="text-[11px] opacity-60 mt-2 text-right">{msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString() : ''}{msg.pending && ' • sending…'}</div>
                </div>
              </div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        <div className="px-4 py-3 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <input
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendChat(); }}
              placeholder="Type a message and hit Enter"
              className="flex-1 bg-white/5 px-3 py-2 rounded text-sm placeholder:text-gray-400 focus:outline-none"
              aria-label="Chat input"
            />
            <button onClick={sendChat} className="px-3 py-2 bg-indigo-600 rounded text-sm">Send</button>
          </div>
        </div>
      </aside>

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 transform transition-all`} role="status" aria-live="polite">
          <div className={`px-4 py-2 rounded-md ${toast.type === 'error' ? 'bg-rose-500 text-white' : 'bg-gray-800 text-white'}`}>{toast.message}</div>
        </div>
      )}
    </div>
  );
}
