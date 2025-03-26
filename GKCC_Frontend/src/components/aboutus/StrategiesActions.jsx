import React from 'react';

const StrategiesActions = () => {
  return (
    <div className="w-full bg-gray-100 py-10">
      <section className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-3xl font-semibold text-black mb-6 text-center">
          STRATEGIES / ACTION PLANS
        </h1>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-black">Community</h2>
            <p className="text-gray-600">
              Assess strengths and weaknesses, actively seeking opportunities to transform weaknesses into strengths.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-black">Members</h2>
            <p className="text-gray-600">
              Identify and leverage talents of members in the Gulf region to harness their skills effectively.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-black">Sustainability</h2>
            <p className="text-gray-600">
              Develop a finance policy with a focus on identifying revenue-generating resources to achieve sustainability.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h2 className="text-xl font-semibold text-black">Leadership</h2>
            <p className="text-gray-600">
              Establish a Core Committee Board & develop members for the leadership pipeline.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StrategiesActions;
