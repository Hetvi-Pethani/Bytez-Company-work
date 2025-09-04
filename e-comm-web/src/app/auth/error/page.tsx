'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function AuthError() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Authentication Error
          </h2>
          <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative">
            <p className="text-center">
              {error || 'An error occurred during authentication'}
            </p>
          </div>
          <div className="mt-4 text-center">
            <Link
              href="/auth/signin"
              className="font-medium text-gray-900 hover:text-gray-800"
            >
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 