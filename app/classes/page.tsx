'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Class {
  id: string;
  name: string;
  schoolId: string;
}

export default function ClassManagement() {
  const [classes, setClasses] = useState<Class[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newClass, setNewClass] = useState({ name: '', schoolId: '' });

  useEffect(() => {
    const fetchClasses = async () => {
      const { data: classesList, error } = await supabase
        .from('classes')
        .select('*');
      
      if (error) {
        console.error('Error fetching classes:', error);
        return;
      }
      setClasses(classesList || []);
    };
    fetchClasses();
  }, []);

  const handleAddClass = async () => {
    const { error } = await supabase
      .from('classes')
      .insert(newClass);
    
    if (error) {
      console.error('Error adding class:', error);
      return;
    }
    setIsOpen(false);
    // Refresh class list
    const { data: classesList, error: refreshError } = await supabase
      .from('classes')
      .select('*');
    
    if (refreshError) {
      console.error('Error refreshing classes:', refreshError);
      return;
    }
    setClasses(classesList || []);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Class Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>Add Class</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Class</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newClass.name} onChange={e => setNewClass({ ...newClass, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="schoolId" className="text-right">School ID</Label>
                <Input id="schoolId" value={newClass.schoolId} onChange={e => setNewClass({ ...newClass, schoolId: e.target.value })} className="col-span-3" />
              </div>
            </div>
            <Button onClick={handleAddClass}>Save Class</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>School ID</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {classes.map(cls => (
            <TableRow key={cls.id}>
              <TableCell>{cls.name}</TableCell>
              <TableCell>{cls.schoolId}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
