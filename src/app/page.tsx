import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function HomePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50">
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-gradient-ese"></div>
            <h1 className="font-heading text-xl font-bold">ESE Evaluation & Recognition</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{session.user?.email}</span>
            <Button variant="outline" size="sm" asChild>
              <Link href="/api/auth/signout">Sign Out</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="font-heading text-3xl font-bold text-gray-900">
            Welcome, {session.user?.name || 'User'}
          </h2>
          <p className="text-muted-foreground mt-1">
            {session.user?.title} · {session.user?.department}
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Employee of the Month</CardTitle>
              <CardDescription>Recognize outstanding colleagues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {session.user?.role === 'LEAD' || session.user?.role === 'PC' || session.user?.role === 'CEO' ? (
                <>
                  <Button className="w-full" variant="default" asChild>
                    <Link href="/eom/nominate">Nominate</Link>
                  </Button>
                  <Button className="w-full" variant="outline" asChild>
                    <Link href="/eom/vote">Vote</Link>
                  </Button>
                </>
              ) : null}
              <Button className="w-full" variant="ghost" asChild>
                <Link href="/eom/winners">View Winners</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Multi-Rater Evaluation</CardTitle>
              <CardDescription>360-degree performance reviews</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full" variant="default" asChild>
                <Link href="/mre/assignments">My Assignments</Link>
              </Button>
            </CardContent>
          </Card>

          {(session.user?.role === 'CEO' || session.user?.role === 'PC') && (
            <Card>
              <CardHeader>
                <CardTitle>Administration</CardTitle>
                <CardDescription>Manage system settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button className="w-full" variant="default" asChild>
                  <Link href="/admin">Admin Panel</Link>
                </Button>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Help & Support</CardTitle>
              <CardDescription>Learn how to use the system</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" variant="outline" asChild>
                <Link href="/help">View Help</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-8 rounded-lg border border-blue-200 bg-blue-50 p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Stats</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <div className="text-2xl font-bold text-blue-primary">0</div>
              <div className="text-sm text-blue-700">Pending Nominations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-primary">0</div>
              <div className="text-sm text-green-700">Pending Evaluations</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-700">0</div>
              <div className="text-sm text-gray-600">Total Recognitions</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
