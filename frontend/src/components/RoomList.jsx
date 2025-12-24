import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { myRooms } from '../redux/interviewerSlice';
import { Link } from 'react-router-dom';
import axios from 'axios';

// Improved RoomList: better visuals, per-card loading, copy feedback, debounce filter
const RoomList = ({ interviewerId }) => {
  const [languageFilter, setLanguageFilter] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState(null); // room being ended/deleted
  const [copiedId, setCopiedId] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');

  const dispatch = useDispatch();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const token = localStorage.getItem('token');

  const debounceRef = useRef(null);
  const hideMsgRef = useRef(null);

  useEffect(() => {
    // initial fetch
    fetchRooms();

    return () => {
      clearTimeout(debounceRef.current);
      clearTimeout(hideMsgRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced fetch when language filter changes
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchRooms();
    }, 300);
    return () => clearTimeout(debounceRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageFilter]);

  const fetchRooms = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await dispatch(myRooms({ search: languageFilter, interviewerId }));
      const data = res.payload;

      if (Array.isArray(data)) {
        setRooms(data);
      } else if (data?.rooms && Array.isArray(data.rooms)) {
        setRooms(data.rooms);
      } else {
        setRooms([]);
      }
    } catch (err) {
      console.error('Error fetching rooms:', err);
      setError('Unable to load rooms. Please try again.');
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const endRoom = async (room) => {
    const roomId = room.roomId;
    const isActive = room.isActive;

    // confirmation
    const confirmMsg = isActive ? 'End this active room?' : 'Delete this room permanently?';
    if (!window.confirm(confirmMsg)) return;

    setProcessingId(roomId);
    try {
      const endpoint = isActive ? '/api/end-room' : '/api/delete-room';
      const res = await axios.post(
        `${backendUrl}${endpoint}`,
        { roomId },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.success) {
        setSuccessMsg(isActive ? 'Room ended' : 'Room deleted');
        hideMsgRef.current = setTimeout(() => setSuccessMsg(''), 3000);
        // refresh list
        fetchRooms();
      } else {
        setError(res.data?.message || 'Action failed');
      }
    } catch (err) {
      console.error('Error in endRoom:', err);
      setError('Network error. Try again.');
    } finally {
      setProcessingId(null);
    }
  };

  const copyLink = async (room) => {
    const url = `${window.location.origin}/room/${room.roomId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(room.roomId);
      setSuccessMsg('Link copied to clipboard');
      hideMsgRef.current = setTimeout(() => {
        setCopiedId(null);
        setSuccessMsg('');
      }, 2500);
    } catch (err) {
      console.error('Copy failed', err);
      setError('Unable to copy link');
      setTimeout(() => setError(''), 2500);
    }
  };

  const openRoom = (room) => {
    window.open(`${window.location.origin}/room/${room.roomId}`, '_blank');
  };

  const languages = ['All', 'JavaScript', 'Java', 'Python', 'TypeScript', 'C++'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Your Interview Rooms</h2>

        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-500">Filter:</div>
          <div className="flex gap-2 flex-wrap">
            {languages.map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguageFilter(lang === 'All' ? '' : lang)}
                className={`px-3 py-1 rounded-full text-sm transition-shadow focus:outline-none focus:ring-2 focus:ring-indigo-400 ${
                  (languageFilter === '' && lang === 'All') || languageFilter === lang
                    ? 'bg-indigo-600 text-white shadow'
                    : 'bg-gray-100 text-gray-800'
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div className="flex items-center justify-between text-sm text-gray-500">
        <div>
          {loading ? 'Loading rooms...' : `${rooms.length} room${rooms.length !== 1 ? 's' : ''}`}
        </div>
        <div className="flex items-center gap-3">
          {successMsg && <div className="text-emerald-400">{successMsg}</div>}
          {error && <div className="text-rose-400">{error}</div>}
          <button onClick={fetchRooms} className="text-xs px-2 py-1 bg-gray-100 rounded hover:shadow">
            Refresh
          </button>
        </div>
      </div>

      {/* Room list or empty state */}
      {loading ? (
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-white/5 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-white/10 w-1/2 rounded" />
                  <div className="h-3 bg-white/8 w-1/3 rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center p-8 bg-white/5 rounded">
          <p className="text-gray-400 mb-3">No rooms to show</p>
          <p className="text-sm text-gray-500">Create a new room to start interviewing — it will show up here.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {rooms.map((room) => (
            <div
              key={room.roomId}
              className="flex items-center justify-between bg-white/5 p-4 rounded-lg hover:shadow-md transition-shadow"
            >
              <Link to={`/session/${room.roomId}`} className="flex items-center gap-4 flex-1">
                <div
                  className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                  style={{ background: room.isPrivate ? 'linear-gradient(180deg,#7c3aed,#4f46e5)' : 'linear-gradient(180deg,#06b6d4,#0ea5a4)' }}
                >
                  {room.name ? room.name.charAt(0).toUpperCase() : 'R'}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-medium text-white truncate">{room.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${room.isActive ? 'bg-emerald-600/20 text-emerald-200' : 'bg-gray-600/20 text-gray-300'}`}>
                      {room.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="text-sm text-gray-400 truncate mt-1">
                    {room.language || '—'} • {room.participants ?? 0} participant{(room.participants ?? 0) !== 1 ? 's' : ''}
                  </div>
                </div>
              </Link>

              <div className="flex items-center gap-2 ml-4">
                <button
                  onClick={() => copyLink(room)}
                  className="text-sm px-3 py-2 bg-white/5 rounded hover:bg-white/10"
                  title="Copy invitation link"
                >
                  {copiedId === room.roomId ? 'Copied' : 'Copy'}
                </button>

                <button
                  onClick={() => openRoom(room)}
                  className="text-sm px-3 py-2 bg-white/5 rounded hover:bg-white/10"
                  title="Open room in new tab"
                >
                  Open
                </button>

                <button
                  onClick={() => endRoom(room)}
                  disabled={processingId === room.roomId}
                  className={`text-sm px-3 py-2 rounded ${processingId === room.roomId ? 'opacity-60 cursor-not-allowed' : room.isActive ? 'bg-rose-500 text-white' : 'bg-gray-700 text-white'}`}
                >
                  {processingId === room.roomId ? 'Working…' : room.isActive ? 'End' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomList;
