import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignUpSuccessPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#c9dfd3" }}>
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Check your email</CardTitle>
            <CardDescription>We&apos;ve sent a confirmation link to your email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Click the link in the email to confirm your account and start using the app.
            </p>
            <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
              Back to login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}