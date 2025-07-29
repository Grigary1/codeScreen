import React from 'react';

const InvitePanel = () => {
  const sendInvite = () => {
    // TODO: open modal or send email invite
    console.log('Send invite');
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h3 className="font-semibold mb-2">Invite Candidates</h3>
      <button
        onClick={sendInvite}
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
      >
        Generate Invite Link
      </button>
    </div>
  );
};

export default InvitePanel;