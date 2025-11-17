'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import RegisterForm from '@/components/auth/RegisterForm';
import ConfirmSignUpForm from '@/components/auth/ConfirmSignUpForm';

export default function RegisterPage() {
  const [step, setStep] = useState<'register' | 'confirm'>('register');
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleRegisterSuccess = (userEmail: string) => {
    setEmail(userEmail);
    setStep('confirm');
  };

  const handleConfirmSuccess = () => {
    router.push('/auth/login?message=Account confirmed successfully');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {step === 'register' ? (
        <RegisterForm onSuccess={handleRegisterSuccess} />
      ) : (
        <ConfirmSignUpForm email={email} onSuccess={handleConfirmSuccess} />
      )}
    </div>
  );
}
