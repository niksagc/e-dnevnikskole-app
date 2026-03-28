'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader><CardTitle>Manage Users</CardTitle></CardHeader>
          <CardContent><p>Manage teachers, students, and parents.</p></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Manage Schools</CardTitle></CardHeader>
          <CardContent><p>Manage school information.</p></CardContent>
        </Card>
      </div>
    </div>
  );
}
