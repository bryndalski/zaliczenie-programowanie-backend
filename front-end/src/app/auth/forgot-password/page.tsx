'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleRequestSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep('reset');
  };

  const handleResetSuccess = () => {
    router.push('/auth/login?message=Password reset successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {step === 'request' ? (
        <ForgotPasswordForm onSuccess={handleRequestSuccess} />
      ) : (
        <ResetPasswordForm email={email} onSuccess={handleResetSuccess} />
      )}
    </div>
  );
}
