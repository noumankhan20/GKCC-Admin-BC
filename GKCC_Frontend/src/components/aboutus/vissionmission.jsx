import React from 'react';

const VisionMission = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">VISION</h1>
        <p className="text-gray-700 text-lg text-center">
          To be a Global Kokani Organization dedicated to uplift the
          Social and Economic status of our Community, through various
          development programs.
        </p>

        <hr className="my-6 border-gray-300" />

        <h1 className="text-2xl font-bold text-center text-blue-600 mb-4">MISSION</h1>
        <div className="text-gray-700 text-lg">
          <p><strong className="text-blue-500">Unity:</strong> Serve the Kokan Community by creating a united Pan-Gulf Platform of regional Kokan Committees.</p>
          <p className="mt-2"><strong className="text-blue-500">Economic Status:</strong> Promote entrepreneurship by forging strategic partnerships and facilitating access to resources.</p>
          <p className="mt-2"><strong className="text-blue-500">Education & Skills Enhancement:</strong> Provide access to quality education, vocational training, and mentorship to acquire and enhance skills.</p>
        </div>
      </div>
    </section>
  );
};

export default VisionMission;
