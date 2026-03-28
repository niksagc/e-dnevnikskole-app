'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ParentDashboard() {
  const router = useRouter();

  useEffect(() => {
    router.push('/portal');
  }, [router]);

  return <div className="p-8">Redirecting to portal...</div>;
}
