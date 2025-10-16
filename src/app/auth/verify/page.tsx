import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function VerifyPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-ese px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="font-heading text-2xl">Check Your Email</CardTitle>
          <CardDescription>A sign-in link has been sent to your email address</CardDescription>
        </CardHeader>
        <CardContent className="text-center text-sm text-muted-foreground">
          <p>Click the link in the email to sign in to your account.</p>
          <p className="mt-4">You can close this tab.</p>
        </CardContent>
      </Card>
    </div>
  );
}
