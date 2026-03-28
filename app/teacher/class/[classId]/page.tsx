'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ClassBookPage() {
  const { classId } = useParams();
  const [students, setStudents] = useState<any[]>([]);
  const [grade, setGrade] = useState('');
  const [subjectId, setSubjectId] = useState('');

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

  const addGrade = async (studentId: string) => {
    if (!grade || !subjectId) return;
    const { error } = await supabase
      .from('grades')
      .insert({
        studentId,
        subjectId,
        grade: Number(grade),
        date: new Date().toISOString().split('T')[0]
      });
    
    if (error) {
      console.error('Error adding grade:', error);
      return;
    }
    setGrade('');
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Class Book</h1>
      <div className="mb-4">
        <Select onValueChange={(value: any) => setSubjectId(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select Subject" />
          </SelectTrigger>
          <SelectContent>
            {/* Fetch subjects dynamically */}
            <SelectItem value="math">Math</SelectItem>
            <SelectItem value="science">Science</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-4">
        {students.map(student => (
          <Card key={student.id}>
            <CardContent className="flex items-center justify-between p-4">
              <span>{student.name}</span>
              <div className="flex gap-2">
                <Input 
                  type="number" 
                  placeholder="Grade" 
                  value={grade} 
                  onChange={(e) => setGrade(e.target.value)} 
                  className="w-20"
                />
                <Button onClick={() => addGrade(student.id)}>Add Grade</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
