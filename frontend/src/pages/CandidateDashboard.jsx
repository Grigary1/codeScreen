import React, { useEffect, useState } from 'react'

import JoinByLink from '../components/Candidate/JoinByLink'
import FilterSort from '../components/Candidate/FilterSort'
import RoomList from '../components/Candidate/RoomList'
import AttendanceStats from '../components/Candidate/AttendanceStats'
import LanguageUsage from '../components/Candidate/LanguageUsage'
import CalendarIntegration from '../components/Candidate/CalendarIntegration'
import NotificationSettings from '../components/Candidate/NotificationSettings'
import PracticeMode from '../components/Candidate/PracticeMode'
import ProblemLibrary from '../components/Candidate/ProblemLibrary'
import SnippetVault from '../components/Candidate/SnippetVault'
import FeedbackForm from '../components/Candidate/FeedbackForm'
import TranscriptHistory from '../components/Candidate/TranscriptHistory'
import PrivateNotes from '../components/Candidate/PrivateNotes'
import Achievements from '../components/Candidate/Achievements'
import Leaderboard from '../components/Candidate/Leaderboard'
import ProfileSettings from '../components/Candidate/ProfileSettings'
import SearchBar from '../components/Candidate/SearchBar'

export default function CandidateDashboard() {
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    // TODO: fetchAssignedRooms from `/api/candidate/rooms`
    setRooms([
      { roomId: 'abc123', interviewer: 'Alice', time: '2025-08-04T10:00:00Z', language: 'JavaScript', status: 'upcoming' },
      { roomId: 'xyz456', interviewer: 'Bob',   time: '2025-08-05T14:00:00Z', language: 'Python', status: 'upcoming' },
      { roomId: 'past789', interviewer: 'Carol', time: '2025-07-20T09:00:00Z', language: 'Java', status: 'past' },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold leading-tight">Candidate Dashboard</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your interviews and track progress</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block w-80">
              <SearchBar />
            </div>
            <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm hover:shadow-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="text-sm font-medium text-blue-600">New Room</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Controls */}
        <section className="bg-white rounded-lg shadow px-6 py-5 mb-6 border border-gray-100">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <SearchBar />
            </div>
            <div className="flex items-center gap-3">
              <JoinByLink />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">Create Room</button>
            </div>
          </div>
        </section>

        {/* Filters & Room List */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <FilterSort />
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <RoomList rooms={rooms} />
            </div>
          </div>

          <aside className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold">Upcoming</h3>
                  <p className="text-xs text-gray-500 mt-1">Next sessions & quick actions</p>
                </div>
                <div className="text-sm text-gray-500">{rooms.length}</div>
              </div>

              <div className="mt-4 space-y-3">
                {rooms.slice(0,3).map(r => (
                  <div key={r.roomId} className="flex items-center justify-between p-2 rounded-md hover:bg-gray-50">
                    <div>
                      <div className="text-sm font-medium">{r.interviewer}</div>
                      <div className="text-xs text-gray-400">{new Date(r.time).toLocaleString()} • {r.language}</div>
                    </div>
                    <button className="px-3 py-1 bg-blue-50 text-blue-600 border border-blue-100 rounded-md text-sm">Join</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
              <h4 className="text-sm font-semibold mb-3">Profile</h4>
              <ProfileSettings />
            </div>
          </aside>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <AttendanceStats />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <LanguageUsage />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <CalendarIntegration />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <NotificationSettings />
          </div>
        </section>

        {/* Practice & Resources */}
        <section className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Practice & Resources</h2>
            <div className="text-sm text-gray-500">Sharpen skills before interviews</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-md bg-gray-50 border border-gray-100">
              <PracticeMode />
            </div>
            <div className="p-4 rounded-md bg-gray-50 border border-gray-100">
              <ProblemLibrary />
            </div>
            <div className="p-4 rounded-md bg-gray-50 border border-gray-100">
              <SnippetVault />
            </div>
          </div>
        </section>

        {/* Reflection & History */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <FeedbackForm />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <TranscriptHistory />
          </div>
        </section>

        {/* Notes, Achievements, Leaderboard */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <PrivateNotes />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <Achievements />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4">
            <Leaderboard />
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-10 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} Interview Platform — All rights reserved
        </footer>
      </main>
    </div>
  )
}
