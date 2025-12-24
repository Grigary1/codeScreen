import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { createRoom } from "../redux/interviewerSlice";

const RoomCreationForm = () => {
  const [name, setName] = useState("");
  const [language, setLanguage] = useState("JavaScript");
  const [isPrivate, setIsPrivate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [invitationLink, setInvitationLink] = useState("");

  const dispatch = useDispatch();
  const timerRef = useRef(null);
  const nameInputRef = useRef(null);

  useEffect(() => {
    return () => clearTimeout(timerRef.current);
  }, []);

  const resetStatus = () => {
    setSuccessMsg("");
    setErrorMsg("");
    setInvitationLink("");
  };

  const handleCreateRoom = async (e) => {
    if (e && e.preventDefault) e.preventDefault();

    // basic validation
    if (!name.trim()) {
      setErrorMsg("Please enter a room name.");
      timerRef.current = setTimeout(() => setErrorMsg(""), 3500);
      return;
    }

    resetStatus();
    setLoading(true);

    try {
      const res = await dispatch(createRoom({ name, language, isPrivate }));
      const data = res?.payload || {};

      if (data.success) {
        setSuccessMsg("Room created successfully!");
        // use provided invitationLink or create a placeholder
        setInvitationLink(data.invitationLink || `${window.location.origin}/room/${data.roomId || Math.random().toString(36).slice(2,9)}`);
        timerRef.current = setTimeout(() => setSuccessMsg("") , 5000);
      } else {
        setErrorMsg(data.message || "Failed to create room. Try again.");
        timerRef.current = setTimeout(() => setErrorMsg("") , 5000);
      }
    } catch (err) {
      setErrorMsg(err?.message || "Unexpected error");
      timerRef.current = setTimeout(() => setErrorMsg("") , 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePrivate = () => setIsPrivate((p) => !p);

  const handleToggleKey = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleTogglePrivate();
    }
  };

  const copyLink = async () => {
    if (!invitationLink) return;
    try {
      await navigator.clipboard.writeText(invitationLink);
      setSuccessMsg("Invitation link copied!");
      timerRef.current = setTimeout(() => setSuccessMsg("") , 3000);
    } catch {
      setErrorMsg("Unable to copy link.");
      timerRef.current = setTimeout(() => setErrorMsg("") , 3000);
    }
  };

  return (
    <div className="font-sans bg-gray-900 text-white min-h-screen p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      {/* Background Glow Effects */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-pulse"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-600 rounded-full mix-blend-lighten filter blur-3xl opacity-10 animate-pulse animation-delay-4000"></div>

      <div className="relative z-10 max-w-4xl mx-auto">
        <form onSubmit={handleCreateRoom} className="grid grid-cols-1 gap-8 mt-6">
          {/* TOP: Form Card */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50">
            <div className="flex items-center gap-4 mb-6">
              <div
                role="button"
                tabIndex={0}
                onClick={() => nameInputRef.current?.focus()}
                onKeyDown={(e) => { if (e.key === 'Enter') nameInputRef.current?.focus(); }}
                className="bg-gradient-to-br from-indigo-500 to-purple-500 p-3 rounded-lg cursor-pointer"
                aria-label="Focus room name input"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                  <path d="M3 7a2 2 0 0 1 2-2h4l2-2h4l2 2h2a2 2 0 0 1 2 2v5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <rect x="3" y="12" width="18" height="8" rx="2" stroke="white" strokeWidth="1.5"/>
                </svg>
              </div>

              <div>
                <h2
                  onClick={() => nameInputRef.current?.focus()}
                  className="text-2xl font-bold text-white cursor-pointer"
                >
                  Create Interview Room
                </h2>
                <p className="text-gray-400 mt-1 text-sm">Setup a collaborative environment for technical interviews</p>
              </div>
            </div>

            <div className="space-y-6">
              {/* Room Name */}
              <label className="block">
                <span className="text-sm text-gray-300 flex items-center gap-2 mb-2">
                  Room name
                  <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-400">required</span>
                </span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7h18M6 11h12M9 15h6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </span>
                  <input
                    ref={nameInputRef}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Frontend Pairing - Session A"
                    className="w-full pl-11 pr-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </label>

              {/* Language & Privacy */}
              <div className="flex gap-4 items-center">
                <div className="flex-1">
                  <label className="block text-sm text-gray-300 mb-2">Language</label>
                  <div className="relative">
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full bg-gray-700/50 border border-gray-600 rounded-lg py-3 pl-4 pr-10 text-white appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                      aria-label="Select language"
                    >
                      <option>JavaScript</option>
                      <option>Python</option>
                      <option>Java</option>
                      <option>C++</option>
                      <option>TypeScript</option>
                    </select>
                    <span className="absolute right-3 top-3 text-gray-400 pointer-events-none">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0">
                  <label className="block text-sm text-gray-300 mb-2">Privacy</label>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-14 h-8 flex items-center p-1 rounded-full transition-colors cursor-pointer ${isPrivate ? 'bg-indigo-600' : 'bg-gray-700'}`}
                      onClick={handleTogglePrivate}
                      role="switch"
                      tabIndex={0}
                      onKeyDown={handleToggleKey}
                      aria-checked={isPrivate}
                    >
                      <div className={`bg-white w-6 h-6 rounded-full shadow transform transition-transform ${isPrivate ? 'translate-x-6' : 'translate-x-0'}`} />
                    </div>
                    <span className="text-sm text-gray-300">{isPrivate ? 'Private' : 'Public'}</span>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-400 pt-2">
                <p>Private rooms require an invitation link to join</p>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full inline-flex items-center justify-center gap-3 py-3 px-4 ${loading ? 'opacity-80 cursor-not-allowed' : 'hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600'} bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-xl text-white font-semibold shadow-lg transition-transform active:scale-95`}
                  aria-label="Create Interview Room"
                >
                  {loading ? (
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                  ) : successMsg ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 6L9 17l-5-5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2v6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M5 11h14" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M7 21h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  )}

                  {loading ? 'Creating...' : successMsg ? 'Created' : 'Create Interview Room'}
                </button>
              </div>

              {/* Inline status messages (accessible) */}
              <div className="mt-2" aria-live="polite">
                {successMsg && <div className="text-sm text-emerald-400">{successMsg}</div>}
                {errorMsg && <div className="text-sm text-rose-400">{errorMsg}</div>}
              </div>
            </div>
          </div>

          {/* BOTTOM: Preview Panel */}
          <div className="bg-gray-800/50 backdrop-blur-xl p-6 rounded-2xl border border-gray-700/50">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white">Room Preview</h3>
              <div className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">Live update</div>
            </div>

            <div className="rounded-xl border border-gray-600 bg-gray-700/30 p-5 mb-6">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                    {name ? name.charAt(0).toUpperCase() : 'R'}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-white font-bold text-lg">{name || "Untitled Interview Room"}</div>
                      <div className="text-sm text-gray-400 mt-1">{language} • {isPrivate ? "Private" : "Public"}</div>
                    </div>
                    <div className={`text-xs px-2.5 py-1 rounded-full font-medium ${isPrivate ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                      {isPrivate ? 'Locked' : 'Open'}
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-gray-400">
                    <p>Participants will join via unique invitation link after room creation</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Participants</div>
                <div className="text-white font-bold text-xl">0</div>
              </div>
              <div className="p-4 bg-gray-700/30 border border-gray-600 rounded-xl">
                <div className="text-xs text-gray-400 mb-1">Duration</div>
                <div className="text-white font-bold text-xl">45 min</div>
              </div>
            </div>

            {invitationLink && (
              <div className="mt-6 pt-4 border-t border-gray-700/50 flex items-start gap-3">
                <div className="flex-1">
                  <div className="text-sm text-gray-400 mb-1">Invitation Link</div>
                  <div className="bg-gray-700/40 border border-gray-600 rounded p-3 break-words text-sm">{invitationLink}</div>
                </div>

                <div className="flex-shrink-0 flex flex-col gap-2">
                  <button onClick={copyLink} className="px-3 py-2 bg-indigo-600 rounded text-sm font-medium hover:opacity-90 cursor-pointer">
                    Copy
                  </button>
                  <button onClick={() => navigator.share ? navigator.share({ title: 'Join interview', url: invitationLink }) : window.open(invitationLink, '_blank')} className="px-3 py-2 bg-gray-600 rounded text-sm font-medium hover:opacity-90 cursor-pointer">
                    Open
                  </button>
                </div>
              </div>
            )}

            {!invitationLink && (
              <div className="mt-6 pt-4 border-t border-gray-700/50">
                <div className="text-sm text-gray-400">
                  <span className="font-medium text-gray-300">Tip:</span> Verify settings before creating the room. You can always edit privacy settings later.
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RoomCreationForm;
