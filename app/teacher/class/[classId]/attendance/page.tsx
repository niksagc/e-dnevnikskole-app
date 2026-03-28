'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, addDoc } from 'firebase/firestore';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AttendancePage() {
  const { classId } = useParams();
  const [students, setStudents] = useState<any[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      const studentsQuery = query(
        collection(db, 'users'),
        where('role', '==', 'student'),
        where('classId', '==', classId)
      );
      const studentsSnapshot = await getDocs(studentsQuery);
      setStudents(studentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchStudents();
  }, [classId]);

  const markAttendance = async (studentId: string, status: string) => {
    await addDoc(collection(db, 'attendance'), {
      studentId,
      date: new Date().toISOString().split('T')[0],
      status
    });
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
