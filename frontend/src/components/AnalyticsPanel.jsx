import React from 'react';

const AnalyticsPanel = () => {
  // TODO: fetch analytics data
  const data = {
    totalSessions: 10,
    candidatesInterviewed: 8,
    avgSessionTime: '45m',
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-4">Room Analytics</h3>
      <ul className="space-y-2 text-gray-700">
        <li>Total Sessions: {data.totalSessions}</li>
        <li>Candidates Interviewed: {data.candidatesInterviewed}</li>
        <li>Average Session Time: {data.avgSessionTime}</li>
      </ul>
    </div>
  );
};

export default AnalyticsPanel;