import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function EmailVerifiedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: "#c9dfd3" }}>
      <div className="w-full max-w-sm">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">Email Verified! </CardTitle>
            <CardDescription>Your email has been successfully verified.</CardDescription>
          </CardHeader>
          
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Great! Your account is now active and you can start using all features.
            </p>
            <Link href="/auth/login" className="text-green-600 hover:underline font-medium">
              Continue to Login
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}