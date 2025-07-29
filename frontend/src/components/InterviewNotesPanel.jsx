import React, { useState } from 'react';

const InterviewNotesPanel = () => {
  const [notes, setNotes] = useState('');

  const saveNotes = () => {
    // TODO: API call to save notes
    console.log('Save notes', notes);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Interview Notes</h3>
      <textarea
        value={notes}
        onChange={(e) => setNotes(e.target.value)}
        placeholder="Write your notes here..."
        className="w-full h-32 border p-2 rounded"
      />
      <button
        onClick={saveNotes}
        className="mt-2 bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600"
      >
        Save Notes
      </button>
    </div>
  );
};

export default InterviewNotesPanel;