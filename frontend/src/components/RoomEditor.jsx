import React, { useEffect, useRef, useState } from 'react';
import Editor from '@monaco-editor/react';

const RoomEditor = () => {
    const [code, setCode] = useState('// Start coding...');
    const [keystrokes, setKeystrokes] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [wpm, setWPM] = useState(0);
    const [language, setLanguage] = useState('javascript');

    const users = ['Interviewer', 'Candidate']; // Replace with dynamic user list
    const comments = ['Use a for loop.', 'Consider null check.'];
    const chat = ['Hey, ready?', 'Yes, let’s start!'];

    const editorRef = useRef(null);

    // Handle WPM calculation
    useEffect(() => {
        if (!startTime && code.length > 0) {
            setStartTime(Date.now());
        }
        if (startTime) {
            const words = code.trim().split(/\s+/).length;
            const minutes = (Date.now() - startTime) / 60000;
            setWPM(Math.round(words / minutes) || 0);
        }
    }, [code]);

    const handleCodeChange = (value) => {
        setCode(value);
        setKeystrokes((prev) => prev + 1);
    };

    const handleRunCode = () => {
        alert(`Running ${language} code:\n\n${code}`);
        // Optionally send to backend here
    };

    const handleEditorDidMount = (editor) => {
        editorRef.current = editor;
    };

    return (
        <div className="grid grid-cols-4 gap-4 h-screen p-4 bg-gray-100">
            {/* Code Area */}
            <div className="col-span-3 flex flex-col">
                <div className="flex justify-between items-center mb-2">
                    <div className="text-sm">
                        <strong>WPM:</strong> {wpm} | <strong>Keystrokes:</strong> {keystrokes}
                    </div>
                    <select
                        className="border rounded px-2 py-1"
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                    >
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                        <option value="cpp">C++</option>
                        <option value="java">Java</option>
                    </select>
                </div>

                {/* Monaco Editor */}
                <div className="flex-1 border rounded overflow-hidden">
                    <Editor
                        height="100%"
                        language={language}
                        value={code}
                        onChange={handleCodeChange}
                        onMount={handleEditorDidMount}
                        theme="vs-dark"
                        options={{
                            fontSize: 14,
                            minimap: { enabled: false },
                            scrollBeyondLastLine: false,
                            wordWrap: 'on',
                            lineNumbers: 'on',
                            tabSize: 2,
                            insertSpaces: true,
                            renderWhitespace: 'all',
                            cursorStyle: 'line',
                            autoClosingBrackets: 'always',
                            formatOnType: true,
                            formatOnPaste: true,
                            suggestOnTriggerCharacters: true,
                            quickSuggestions: true,
                            mouseWheelZoom: true,
                            glyphMargin: true,
                        }}
                    />

                </div>

                {/* Run Button */}
                <div className="mt-2">
                    <button
                        onClick={handleRunCode}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                    >
                        Run Code
                    </button>
                </div>
            </div>
            {/* Sidebar */}
            <div className="col-span-1 space-y-4">
                {/* Users */}
                <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold mb-2">Users</h4>
                    <ul className="list-disc ml-5 text-sm">
                        {users.map((u, i) => <li key={i}>{u}</li>)}
                    </ul>
                </div>

                {/* Comments */}
                <div className="bg-white p-4 rounded shadow">
                    <h4 className="font-semibold mb-2">Comments</h4>
                    <ul className="text-sm space-y-1">
                        {comments.map((c, i) => (
                            <li key={i}>• {c}</li>
                        ))}
                    </ul>
                </div>

                {/* Chat */}
                <div className="bg-white p-4 rounded shadow h-40 overflow-y-auto">
                    <h4 className="font-semibold mb-2">Chat</h4>
                    {chat.map((msg, i) => (
                        <p key={i} className="text-sm text-gray-700 mb-1">💬 {msg}</p>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default RoomEditor;
