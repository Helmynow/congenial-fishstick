import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth/auth.config';
import { getUserDashboardData } from '@/lib/dashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const dashboardData = await getUserDashboardData(session.user.id);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-bold text-gray-900">
          Welcome back, {session.user.name || session.user.email}
        </h1>
        <p className="text-muted-foreground mt-1">
          {session.user.title} · {session.user.department}
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Current Cycle
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.currentCycleTerm}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.cycleStatus}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Evaluations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.completedEvaluations}/{dashboardData.totalEvaluations}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.evaluationCompletionRate}% Complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Staff
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData.activeStaffCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Total members</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Notifications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData.hasNotifications ? '!' : '✓'}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {dashboardData.hasNotifications ? 'New updates' : 'All caught up'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Employee of the Month</CardTitle>
            <CardDescription>Recognize outstanding colleagues</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {session.user.role && ['LEAD', 'PC', 'CEO'].includes(session.user.role) ? (
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
            <CardDescription>Complete your evaluation assignments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full" variant="default" asChild>
              <Link href="/mre/assignments">My Assignments</Link>
            </Button>
          </CardContent>
        </Card>

        {session.user.role && ['CEO', 'PC'].includes(session.user.role) && (
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
      </div>
    </div>
  );
}
