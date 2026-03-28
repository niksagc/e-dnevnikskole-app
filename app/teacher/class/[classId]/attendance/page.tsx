'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AttendancePage() {
  const { classId } = useParams();
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const { data: studentsList, error } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
        .eq('classId', classId);
      
      if (error) {
        console.error('Error fetching students:', error);
        return;
      }
      setStudents(studentsList || []);
    };
    fetchStudents();
  }, [classId]);

  const markAttendance = async (studentId: string, status: string) => {
    const { error } = await supabase
      .from('attendance')
      .insert({
        studentId,
        date: new Date().toISOString().split('T')[0],
        status
      });

    if (error) {
      console.error('Error marking attendance:', error);
      return;
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Attendance Tracking</h1>
      <div className="space-y-4">
        {students.map(student => (
          <Card key={student.id}>
            <CardContent className="flex items-center justify-between p-4">
              <span>{student.name}</span>
              <div className="flex gap-2">
                <Button onClick={() => markAttendance(student.id, 'present')}>Present</Button>
                <Button onClick={() => markAttendance(student.id, 'absent')} variant="destructive">Absent</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
