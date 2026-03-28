'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function StudentParentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!auth.currentUser) return;
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUser(userData);
        if (userData.role === 'parent' && userData.childIds) {
          const childrenData = await Promise.all(
            userData.childIds.map(async (childId: string) => {
              const childDoc = await getDoc(doc(db, 'users', childId));
              return { id: childId, ...childDoc.data() };
            })
          );
          setChildren(childrenData);
        }
      }
    };
    fetchUserData();
  }, []);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name}</h1>
      {user.role === 'student' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader><CardTitle>Grades</CardTitle></CardHeader>
            <CardContent><Button onClick={() => router.push('/student/grades')}>View Grades</Button></CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Attendance</CardTitle></CardHeader>
            <CardContent><Button onClick={() => router.push('/student/attendance')}>View Attendance</Button></CardContent>
          </Card>
        </div>
      )}
      {user.role === 'parent' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Your Children</h2>
          {children.map(child => (
            <Card key={child.id}>
              <CardHeader><CardTitle>{child.name}</CardTitle></CardHeader>
              <CardContent>
                <Button onClick={() => router.push(`/parent/child/${child.id}`)}>View Details</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
