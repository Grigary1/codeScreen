import React, { useState } from 'react';
import RoomCreationForm from '../components/RoomCreationForm';
import RoomList from '../components/RoomList';
import InvitePanel from '../components/InvitePanel';
import AnalyticsPanel from '../components/AnalyticsPanel';
import LiveStatusPanel from '../components/LiveStatusPanel';
import SessionTimer from '../components/SessionTimes';
import CodeHistoryPanel from '../components/CodeHistoryPanel';
import InterviewNotesPanel from '../components/InterviewNotesPanel';
import { useEffect } from 'react';


const InterviewerDashboard = () => {
    // Fetch interviewer data and rooms here (stubbed)
    const [interviewerId, setInterviewerId] = useState(null);
    useEffect(() => {
        if (!interviewerId)
            setInterviewerId(localStorage.getItem("user"));
    }, [])

    return (
        <div className="p-6 space-y-8">
            <h1 className="text-3xl font-bold">Interviewer Dashboard</h1>

            {/* Room Creation */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">Create New Room</h2>
                <RoomCreationForm/>
            </section>

            {/* My Rooms */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">My Rooms</h2>
                <RoomList interviewerId={interviewerId} />
            </section>

            {/* Invite & Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <InvitePanel />
                <AnalyticsPanel />
            </div>

            {/* Live Activity & Timer */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <LiveStatusPanel />
                <SessionTimer />
            </div>

            {/* Code History & Notes */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CodeHistoryPanel />
                <InterviewNotesPanel />
            </div>
        </div>
    );
};

export default InterviewerDashboard;