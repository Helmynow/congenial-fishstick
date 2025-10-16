import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function WinnersPage() {
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
        <div className="mx-auto max-w-6xl">
          <div className="mb-8">
            <h1 className="font-heading text-3xl font-bold">Employee of the Month Winners</h1>
            <p className="text-muted-foreground mt-2">
              Celebrating our outstanding team members.
            </p>
          </div>

          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-900">Recognition Hall</CardTitle>
              <CardDescription className="text-green-700">
                Winners are announced on the first working day of each month
              </CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-green-800">
              <p>No winners have been announced yet.</p>
              <p className="mt-2">
                Check back after the CEO approves the nominees and winners are announced.
              </p>
            </CardContent>
          </Card>

          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>Winners will be displayed here with their achievements and certificates.</p>
          </div>
        </div>
      </main>
    </div>
  );
}
