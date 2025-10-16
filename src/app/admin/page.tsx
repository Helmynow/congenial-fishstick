import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has admin permission
  const allowedRoles = ['CEO', 'PC'];
  if (!allowedRoles.includes(session.user?.role || '')) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have admin permissions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/">Return to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-ese"></div>
            <span className="font-heading font-semibold">ESE Admin</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-3xl font-bold">Administration Panel</h1>
          <p className="text-muted-foreground mt-2">
            Manage users, cycles, and system settings.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Import and manage users</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Manage Users
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EOM Cycles</CardTitle>
              <CardDescription>Manage nomination and voting windows</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Manage Cycles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EOM Verification</CardTitle>
              <CardDescription>Verify nominations</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Verify Nominations
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>EOM Winners</CardTitle>
              <CardDescription>Approve and announce winners</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Manage Winners
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>MRE Cycles</CardTitle>
              <CardDescription>Manage evaluation cycles</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Manage Cycles
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Weight Matrix</CardTitle>
              <CardDescription>Configure rater weights</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Configure Weights
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Domain Weights</CardTitle>
              <CardDescription>Configure evaluation domains</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Configure Domains
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>View system audit trail</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                View Logs
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Export and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full" disabled>
                Generate Reports
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
