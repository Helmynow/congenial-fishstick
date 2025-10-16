import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function AssignmentsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-ese"></div>
            <span className="font-heading font-semibold">ESE</span>
          </Link>
          <Button variant="outline" size="sm" asChild>
            <Link href="/">Dashboard</Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold">Multi-Rater Evaluation Assignments</h1>
            <p className="text-muted-foreground mt-2">
              Complete your assigned evaluations.
            </p>
          </div>

          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-900">Evaluation Cycles</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-purple-800">
              <p>
                <strong>Round 1:</strong> December 15-25
              </p>
              <p>
                <strong>Round 2:</strong> March 15-25
              </p>
              <p className="mt-4">
                No active evaluation cycle at this time. Your assignments will appear here when a cycle opens.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Assignments</CardTitle>
                <CardDescription>
                  You have no pending evaluations at this time.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Assignments will be automatically generated when an evaluation cycle opens.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
