import { NextRequest } from "next/server"

export async function getSession(request?: NextRequest | Request | undefined) {
  const url = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/api/get-session`

  const headers: Record<string, string> = {}
  if (request && 'headers' in request) {
    const cookie = (request as Request).headers.get('cookie')
    if (cookie) headers.cookie = cookie
  }

  const res = await fetch(url, { headers, cache: 'no-store' })
  if (!res.ok) return null
  return res.json()
}
