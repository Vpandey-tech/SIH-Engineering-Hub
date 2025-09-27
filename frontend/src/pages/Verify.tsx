// src/pages/Verify.tsx
import React, { useEffect, useState } from 'react';
import { getAuth, applyActionCode } from 'firebase/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Verify() {
  const query = useQuery();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle'|'verifying'|'success'|'error'>('idle');

  useEffect(() => {
    (async () => {
      const oobCode = query.get('oobCode');
      if (!oobCode) {
        setStatus('error');
        return;
      }
      setStatus('verifying');
      try {
        const auth = getAuth();
        await applyActionCode(auth, oobCode);
        // refresh current user's token / state if signed in
        if (auth.currentUser) {
          await auth.currentUser.reload();
          await auth.currentUser.getIdToken(true); // force refresh so custom claims update if changed
        }
        setStatus('success');
        toast.success('Email verified! You can now sign in.');
        setTimeout(()=> navigate('/login'), 1500);
      } catch (err:any) {
        console.error('verify error', err);
        setStatus('error');
        toast.error(err?.message || 'Verification failed');
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="max-w-lg w-full p-6 bg-white rounded shadow text-center">
        {status === 'verifying' && <p>Verifying... please wait.</p>}
        {status === 'success' && <p className="text-green-600 font-semibold">Email verified — redirecting to login...</p>}
        {status === 'error' && <div>
          <p className="text-red-600">Verification failed. Try requesting a new verification email.</p>
          <div className="mt-4"><Button onClick={()=>navigate('/signup')}>Back</Button></div>
        </div>}
      </div>
    </div>
  );
}
