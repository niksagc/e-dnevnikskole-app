'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';

export default function StudentGradesPage() {
  const [grades, setGrades] = useState<any[]>([]);

  useEffect(() => {
    const fetchGrades = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: gradesList, error } = await supabase
        .from('grades')
        .select('*')
        .eq('studentId', user.id);
      
      if (error) {
        console.error('Error fetching grades:', error);
        return;
      }
      setGrades(gradesList || []);
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
