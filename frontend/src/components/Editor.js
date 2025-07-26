import React, { useEffect, useRef, useState } from "react";
import Editor from "@monaco-editor/react";
import { socket } from "../socket";

const CodeEditor = ({ roomId }) => {
  const [code, setCode] = useState("// Start coding...");
  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("receive-code", (incomingCode) => {
      isRemoteUpdate.current = true;
      setCode(incomingCode);
    });

    return () => {
      socket.off("receive-code");
    };
  }, [roomId]);

  const handleChange = (value) => {
    setCode(value);
    if (!isRemoteUpdate.current) {
      socket.emit("code-change", { roomId, code: value });
    }
    isRemoteUpdate.current = false;
  };

  return (
    <div className="h-screen p-4">
      <Editor
        height="90vh"
        defaultLanguage="javascript"
        value={code}
        onChange={handleChange}
      />
    </div>
  );
};

export default CodeEditor;
