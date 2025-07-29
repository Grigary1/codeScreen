import React from 'react';

const CodeHistoryPanel = () => {
  // TODO: fetch code history
  const history = [
    { id: 'h1', timestamp: '2025-07-28 14:00', snippet: 'function foo() {...}' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Code History</h3>
      <ul className="space-y-2">
        {history.map((h) => (
          <li key={h.id} className="text-sm text-gray-700">
            <span className="font-medium">{h.timestamp}:</span> {h.snippet}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CodeHistoryPanel;