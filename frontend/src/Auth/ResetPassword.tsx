import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendResetOTP, resetPassword as resetPasswordApi } from '../utils/auth';

function ResetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  // Handle countdown for resend button
  React.useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0 && resendDisabled) {
      setResendDisabled(false);
    }
  }, [countdown, resendDisabled]);
  
  // Handle email submission
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await sendResetOTP(email);
      
      if (response.success) {
        setSuccess('OTP sent to your email');
        setCurrentStep(2);
        setTimeout(() => {
          setSuccess(null);
          // Focus on first OTP input when moving to the next step
          if (inputRefs.current[0]) {
            inputRefs.current[0].focus();
          }
        }, 1500);
      } else {
        setError(response.message || 'Failed to send OTP');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Send OTP error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle OTP input
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    
    // Update the OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Clear any previous error message when user starts typing again
    if (error) setError(null);
    
    // Auto-focus next input
    if (value.length > 0 && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
    
    // Auto-submit if all digits are filled
    if (index === 5 && value && !newOtp.includes('')) {
      setTimeout(() => {
        setCurrentStep(3);
        setSuccess('OTP verified. Please set a new password.');
        setTimeout(() => setSuccess(null), 1500);
      }, 500);
    }
  };

  // Handle backspace in OTP input
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
    if (e.key === 'Backspace' && (e.target as HTMLInputElement).value === '' && index > 0) {
      inputRefs.current[index - 1]?.focus();
      
      // Update the OTP array
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  // Handle paste for OTP input
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>): void => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.replace(/[^0-9]/g, '').split('').slice(0, 6);
    
    // Fill inputs with pasted digits
    const newOtp = [...otp];
    pasteArray.forEach((char, index) => {
      if (index < 6) {
        newOtp[index] = char;
        if (inputRefs.current[index]) {
          inputRefs.current[index]!.value = char;
        }
      }
    });
    setOtp(newOtp);
    
    // Focus on the next empty input or the last one if all filled
    const nextIndex = Math.min(pasteArray.length, 5);
    inputRefs.current[nextIndex]?.focus();
    
    // Auto-submit if all digits are filled
    if (pasteArray.length >= 6) {
      setTimeout(() => {
        setCurrentStep(3);
        setSuccess('OTP verified. Please set a new password.');
        setTimeout(() => setSuccess(null), 1500);
      }, 500);
    }
  };
  
  // Handle resend OTP
  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setResendDisabled(true);
    setCountdown(60); // 60 seconds cooldown
    setError(null);
    
    try {
      const response = await sendResetOTP(email);
      
      if (response.success) {
        setSuccess('A new verification code has been sent to your email');
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(response.message || 'Failed to resend verification code');
      }
    } catch (err) {
      setError('Failed to resend verification code. Please try again later.');
      console.error('Resend OTP error:', err);
    }
  };
  
  // Handle new password submission
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const response = await resetPasswordApi(email, otp.join(''), newPassword);
      
      if (response.success) {
        setSuccess('Password has been reset successfully!');
        // Redirect to login after short delay
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setError(response.message || 'Failed to reset password');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('Reset password error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-200 to-purple-400">
      <img 
        onClick={() => navigate('/')} 
        src="/logo.png" 
        alt="Logo" 
        className="absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer" 
      />
      
      {/* Error and Success Messages - Shown for all forms */}
      {(error || success) && (
        <div className={`absolute top-20 left-1/2 transform -translate-x-1/2 w-96 px-4 py-3 rounded-md ${
          error ? 'bg-red-900/30 border border-red-500 text-red-200' : 'bg-green-900/30 border border-green-500 text-green-200'
        }`}>
          {error || success}
        </div>
      )}
      
      {/* Step 1: Email Form */}
      {currentStep === 1 && (
        <form 
          onSubmit={handleEmailSubmit}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Reset Password</h1>
          
          <p className="text-center mb-6 text-indigo-300">
            Enter your registered email address
          </p>
          
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" 
              />
            </svg>
            <input 
              type="email" 
              placeholder="Email address" 
              className="bg-transparent outline-none text-white w-full"
              value={email} 
              onChange={e => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit"
            className={`w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3 
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-indigo-950'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send OTP'}
          </button>
          
          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => navigate('/login')}
              className="text-indigo-300 hover:text-indigo-100 text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
      
      {/* Step 2: OTP Form */}
      {currentStep === 2 && (
        <div className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Verification Code</h1>
          
          <p className="text-center mb-6 text-indigo-300">
            Enter the 6-digit code sent to {email}
          </p>
          
          <div 
            className="flex justify-between mb-8" 
            onPaste={handlePaste}
          >
            {Array(6).fill(0).map((_, index) => (
              <input 
                type="text" 
                maxLength={1} 
                key={index} 
                required 
                className="w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                ref={e => { inputRefs.current[index] = e; }}
                onChange={(e) => handleInput(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                value={otp[index]}
                disabled={isSubmitting}
                autoComplete="off"
              />
            ))}
          </div>
          
          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`text-indigo-300 hover:text-indigo-100 text-sm 
                ${resendDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {countdown > 0 
                ? `Resend code in ${countdown}s` 
                : 'Didn\'t receive a code? Resend'}
            </button>
          </div>
          
          <div className="mt-4 text-center">
            <button 
              type="button"
              onClick={() => setCurrentStep(1)}
              className="text-indigo-300 hover:text-indigo-100 text-sm"
            >
              Back to Email
            </button>
          </div>
        </div>
      )}
      
      {/* Step 3: New Password Form */}
      {currentStep === 3 && (
        <form 
          onSubmit={handleResetPassword}
          className="bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm"
        >
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Create New Password</h1>
          
          <p className="text-center mb-6 text-indigo-300">
            Please enter your new password
          </p>
          
          <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <input 
              type="password" 
              placeholder="New password" 
              className="bg-transparent outline-none text-white w-full"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
              minLength={8}
              disabled={isSubmitting}
            />
          </div>
          
          <div className="mb-6 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-5 h-5 text-gray-400" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" 
              />
            </svg>
            <input 
              type="password" 
              placeholder="Confirm new password" 
              className="bg-transparent outline-none text-white w-full"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={8}
              disabled={isSubmitting}
            />
          </div>
          
          <button 
            type="submit"
            className={`w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full
              ${isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:from-indigo-600 hover:to-indigo-950'}`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      )}
    </div>
  );
}

export default ResetPassword;