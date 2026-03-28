'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      const { data: userDoc, error: userError } = await supabase
        .from('users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (userError) throw userError;

      if (userDoc) {
        const role = userDoc.role;
        switch (role) {
          case 'admin':
            router.push('/admin');
            break;
          case 'teacher':
            router.push('/teacher');
            break;
          case 'student':
            router.push('/student/grades');
            break;
          case 'parent':
            router.push('/parent');
            break;
          default:
            router.push('/portal');
        }
      } else {
        setError('User profile not found.');
      }
    } catch (err) {
      setError('Failed to login. Please check your credentials.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Login</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <Input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
            />
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required
            />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <Button type="submit" className="w-full">Login</Button>
          </form>
          <div className="mt-6 pt-4 border-t">
            <p className="text-sm text-center mb-2 text-muted-foreground">Demo Login</p>
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={() => { setEmail('admin@demo.com'); setPassword('password'); }}>Admin</Button>
              <Button variant="outline" size="sm" onClick={() => { setEmail('teacher@demo.com'); setPassword('password'); }}>Teacher</Button>
              <Button variant="outline" size="sm" onClick={() => { setEmail('student@demo.com'); setPassword('password'); }}>Student</Button>
              <Button variant="outline" size="sm" onClick={() => { setEmail('parent@demo.com'); setPassword('password'); }}>Parent</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
