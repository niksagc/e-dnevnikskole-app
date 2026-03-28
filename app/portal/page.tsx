'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function StudentParentDashboard() {
  const [user, setUser] = useState<any>(null);
  const [children, setChildren] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (!authUser) return;

      const { data: userData, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
      
      if (error) {
        console.error('Error fetching user:', error);
        return;
      }
      
      setUser(userData);
      if (userData.role === 'parent' && userData.childIds) {
        const { data: childrenData, error: childrenError } = await supabase
          .from('users')
          .select('*')
          .in('id', userData.childIds);
        
        if (childrenError) {
          console.error('Error fetching children:', childrenError);
          return;
        }
        setChildren(childrenData || []);
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
