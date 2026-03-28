'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function TeacherDashboard() {
  const [classes, setClasses] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      
      const { data: classesList, error } = await supabase
        .from('classes')
        .select('*')
        .eq('teacherId', user.id);
      
      if (error) {
        console.error('Error fetching classes:', error);
        return;
      }
      setClasses(classesList || []);
    };
    fetchClasses();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Teacher Portal</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle>{cls.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push(`/teacher/class/${cls.id}`)}>
                Open Class Book
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
