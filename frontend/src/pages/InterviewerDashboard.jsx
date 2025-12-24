// src/pages/InterviewerDashboard.jsx
import React, { useEffect, useState } from 'react';

import RoomCreationForm from '../components/RoomCreationForm';
import RoomList from '../components/RoomList';
import InvitePanel from '../components/InvitePanel';
import AnalyticsPanel from '../components/AnalyticsPanel';
import LiveStatusPanel from '../components/LiveStatusPanel';
import SessionTimer from '../components/SessionTimes';
import CodeHistoryPanel from '../components/CodeHistoryPanel';
import InterviewNotesPanel from '../components/InterviewNotesPanel';

const InterviewerDashboard = () => {
  const [interviewerId, setInterviewerId] = useState(null);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    if (!interviewerId) {
      setInterviewerId(localStorage.getItem('user'));
    }
  }, [interviewerId]);

  return (
    <div className="min-h-screen bg-slate-900 text-white font-sans">
      {/* Background soft glows */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -right-40 w-[42rem] h-[42rem] rounded-full bg-indigo-700 opacity-10 blur-3xl"></div>
        <div className="absolute bottom-[-8rem] left-[-10rem] w-[36rem] h-[36rem] rounded-full bg-purple-700 opacity-8 blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 to-purple-300">
                  InterviewSync
                </h1>
                <div className="text-xs text-slate-400">Real-time technical interviews — dark UI</div>
              </div>
            </div>

            <nav className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 rounded-lg bg-slate-800/40 px-2 py-1">
                {['dashboard','history','analytics'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-sm px-3 py-1 rounded-md ${
                      activeTab === tab ? 'bg-slate-700 text-indigo-300' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3">
                <div className="text-sm text-slate-400 hidden sm:block">
                  Active sessions: <span className="text-slate-200 ml-1">3</span>
                </div>
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center font-semibold">
                  {interviewerId ? interviewerId.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className=" max-w-[1750px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Main grid */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left / Main Column (spans 2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Rooms list card */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">My Interview Rooms</h3>
                <div className="text-xs text-slate-400">Updated just now</div>
              </div>
              <div>
                <RoomList interviewerId={interviewerId} />
              </div>
            </div>

            {/* Two-column stack: Code history & Notes */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
                <div className="mb-3">
                  <h4 className="text-md font-semibold">Code History</h4>
                </div>
                <CodeHistoryPanel />
              </div>

              <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
                <div className="mb-3">
                  <h4 className="text-md font-semibold">Interview Notes</h4>
                </div>
                <InterviewNotesPanel />
              </div>
            </div>
          </div>

          {/* Right / Sidebar Column */}
          <aside className="space-y-6">
            {/* Create New Room moved here */}
            <div className="bg-gradient-to-r from-slate-800/60 to-slate-900/60 border border-slate-700 rounded-2xl p-5 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Create New Room</h2>
                  <p className="text-sm text-slate-400 mt-1">Quickly spin up a collaborative interview room.</p>
                </div>
                
              </div>
              <RoomCreationForm />
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold">Session Timer</h4>
                <div className="text-xs text-slate-400">Live</div>
              </div>
              <SessionTimer />
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-md font-semibold">Live Status</h4>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  <span className="text-xs text-red-400">Live</span>
                </div>
              </div>
              <LiveStatusPanel />
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="mb-3">
                <h4 className="text-md font-semibold">Invite Participants</h4>
              </div>
              <InvitePanel />
            </div>

            <div className="bg-slate-800/50 rounded-2xl border border-slate-700 p-4">
              <div className="mb-3">
                <h4 className="text-md font-semibold">Session Analytics</h4>
              </div>
              <AnalyticsPanel />
            </div>
          </aside>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-slate-500 text-sm">
          <div>InterviewSync Dashboard • Real-time collaboration for technical interviews</div>
          <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-500">
            <span>Active users: 24</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Rooms created: 127</span>
            <span className="w-1 h-1 rounded-full bg-slate-700"></span>
            <span>Avg. session: 42 min</span>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default InterviewerDashboard;
  