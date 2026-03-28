'use client';

import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface School {
  id: string;
  name: string;
  address: string;
}

export default function SchoolManagement() {
  const [schools, setSchools] = useState<School[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [newSchool, setNewSchool] = useState({ name: '', address: '' });

  useEffect(() => {
    const fetchSchools = async () => {
      const schoolsCollection = collection(db, 'schools');
      const schoolsSnapshot = await getDocs(schoolsCollection);
      const schoolsList = schoolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
      setSchools(schoolsList);
    };
    fetchSchools();
  }, []);

  const handleAddSchool = async () => {
    await addDoc(collection(db, 'schools'), newSchool);
    setIsOpen(false);
    // Refresh school list
    const schoolsCollection = collection(db, 'schools');
    const schoolsSnapshot = await getDocs(schoolsCollection);
    const schoolsList = schoolsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as School));
    setSchools(schoolsList);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">School Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger>
            <Button>Add School</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New School</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Name</Label>
                <Input id="name" value={newSchool.name} onChange={e => setNewSchool({ ...newSchool, name: e.target.value })} className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">Address</Label>
                <Input id="address" value={newSchool.address} onChange={e => setNewSchool({ ...newSchool, address: e.target.value })} className="col-span-3" />
              </div>
            </div>
            <Button onClick={handleAddSchool}>Save School</Button>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Address</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {schools.map(school => (
            <TableRow key={school.id}>
              <TableCell>{school.name}</TableCell>
              <TableCell>{school.address}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
