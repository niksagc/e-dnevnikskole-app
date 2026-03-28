'use client';

import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      if (!auth.currentUser) return;
      const gradesQuery = query(
        collection(db, 'grades'),
        where('studentId', '==', auth.currentUser.uid)
      );
      const gradesSnapshot = await getDocs(gradesQuery);
      setGrades(gradesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchGrades();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Your Grades</h1>
      <div className="space-y-4">
        {grades.map(grade => (
          <Card key={grade.id}>
            <CardContent className="flex justify-between p-4">
              <span>Subject ID: {grade.subjectId}</span>
              <span className="font-bold">{grade.grade}</span>
              <span>{grade.date}</span>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
