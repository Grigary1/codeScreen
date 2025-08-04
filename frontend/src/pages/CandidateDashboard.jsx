import React, { useState, useEffect } from 'react'

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
      { roomId: 'abc123', interviewer: 'Alice', time: '2025-08-04T10:00:00Z' },
      { roomId: 'xyz456', interviewer: 'Bob',   time: '2025-08-05T14:00:00Z' },
      { roomId: 'past789', interviewer: 'Carol', time: '2025-07-20T09:00:00Z' },
    ])
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 mb-8">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your interviews and track your progress</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-8">
        
        {/* Top Controls Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchBar/>
            </div>
            <div className="flex-shrink-0">
              <JoinByLink />
            </div>
          </div>
        </div>

        {/* Filters & Room List Section */}
        <div className="space-y-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <FilterSort />
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <RoomList rooms={rooms} />
          </div>
        </div>

        {/* Stats & Integrations Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Stats & Settings</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <AttendanceStats />
            </div>
            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <LanguageUsage />
            </div>
            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
              <CalendarIntegration />
            </div>
            <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
              <NotificationSettings />
            </div>
          </div>
        </div>

        {/* Practice & Resources Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Practice & Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <PracticeMode />
            </div>
            <div className="bg-teal-50 rounded-lg p-4 border border-teal-100">
              <ProblemLibrary />
            </div>
            <div className="bg-pink-50 rounded-lg p-4 border border-pink-100">
              <SnippetVault />
            </div>
          </div>
        </div>

        {/* Reflection & History Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Reflection & History</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <FeedbackForm />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <TranscriptHistory />
            </div>
          </div>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <PrivateNotes />
          </div>
        </div>

        {/* Gamification & Profile Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Achievements & Profile</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <Achievements />
            </div>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <Leaderboard />
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <ProfileSettings />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}