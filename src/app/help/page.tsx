import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function HelpPage() {
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
            <h1 className="font-heading text-3xl font-bold">Help & Support</h1>
            <p className="text-muted-foreground mt-2">
              Learn how to use the ESE Evaluation & Recognition System.
            </p>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Employee of the Month (EOM)</CardTitle>
                <CardDescription>Recognition and nomination process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">How to Nominate</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Nominations open on the 15th of each month</li>
                    <li>Select a category that best represents the nominee's achievement</li>
                    <li>Provide a clear reason for your nomination</li>
                    <li>You cannot nominate yourself</li>
                    <li>Each person can win only once per academic term</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How to Vote</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Voting window: 18th-20th of each month</li>
                    <li>Cast one vote per category</li>
                    <li>Only verified nominations appear in the voting list</li>
                    <li>You cannot vote for yourself</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Categories</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>Outstanding Leadership:</strong> Exemplary leadership and guidance</li>
                    <li><strong>Team Spirit:</strong> Collaboration and team support</li>
                    <li><strong>Innovation:</strong> Creative problem-solving and new ideas</li>
                    <li><strong>Rising Star:</strong> Emerging talent and growth</li>
                    <li><strong>Service Excellence:</strong> Outstanding service delivery</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Multi-Rater Evaluation (MRE)</CardTitle>
                <CardDescription>360-degree performance review process</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Evaluation Cycles</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li><strong>Round 1:</strong> December 15-25</li>
                    <li><strong>Round 2:</strong> March 15-25</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">How to Complete Evaluations</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>View your assignments in the MRE Assignments page</li>
                    <li>Rate each domain on a 1-5 scale</li>
                    <li>Your ratings are confidential</li>
                    <li>Submit before the cycle closes</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2">Evaluation Domains</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Professionalism</li>
                    <li>Communication</li>
                    <li>Collaboration</li>
                    <li>Innovation</li>
                    <li>Results Orientation</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Need More Help?</CardTitle>
                <CardDescription>Contact support</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  For technical issues or questions, please contact the People & Culture team.
                </p>
                <Button variant="outline">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
