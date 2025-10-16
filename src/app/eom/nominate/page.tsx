import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default async function NominatePage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Check if user has permission
  const allowedRoles = ['CEO', 'PC', 'LEAD'];
  if (!allowedRoles.includes(session.user?.role || '')) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>You don't have permission to nominate.</CardDescription>
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
            <h1 className="font-heading text-3xl font-bold">Employee of the Month - Nominations</h1>
            <p className="text-muted-foreground mt-2">
              Nominate outstanding colleagues for recognition.
            </p>
          </div>

          <Card className="border-amber-200 bg-amber-50">
            <CardHeader>
              <CardTitle className="text-amber-900">Nomination Window</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-800">
              <p>
                <strong>Status:</strong> Nominations will open on the 15th of each month.
              </p>
              <p className="mt-2">
                Please check back during the nomination window to submit your nominations.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Outstanding Leadership</CardTitle>
                <CardDescription>
                  Recognizes exemplary leadership and guidance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Nominate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Spirit</CardTitle>
                <CardDescription>
                  Celebrates collaboration and team support
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Nominate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Innovation</CardTitle>
                <CardDescription>
                  Honors creative problem-solving and new ideas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Nominate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rising Star</CardTitle>
                <CardDescription>
                  Recognizes emerging talent and growth
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Nominate
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Excellence</CardTitle>
                <CardDescription>
                  Celebrates outstanding service delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled className="w-full">
                  Nominate
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
