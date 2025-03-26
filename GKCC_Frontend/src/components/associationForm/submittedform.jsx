// File: components/SubmissionSuccess.jsx

'use client'; // Make sure to mark it as a client component in Next.js 13+

import { useRouter } from 'next/navigation';

const SubmissionSuccess = () => {
  const router = useRouter();

  const handleGoHome = () => {
    // Navigate to the home page
    router.push('/');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-2xl font-semibold mb-4">Your Association form has been submitted! <br/> we&apos;ll short take a look at it thank you for submission</h1>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 mt-5 bg-blue-500 text-white rounded-lg hover:bg-blue-400 transition duration-300"
      >
        Go to Home
      </button>
    </div>
  );
};

export default SubmissionSuccess;
