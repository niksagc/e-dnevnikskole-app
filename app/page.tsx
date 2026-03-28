'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Manage Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Add, edit, or remove teachers and staff.</p>
            <Button className="mt-4">Go to Users</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Schools</CardTitle>
          </CardHeader>
          <CardContent>
            <p>View and manage school information.</p>
            <Button className="mt-4">Go to Schools</Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Manage Classes</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Create and manage class groups.</p>
            <Button className="mt-4">Go to Classes</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
