'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DEMO_COOKIE, passwordsMatch, sessionToken } from '@/lib/lead-flow/admin-session'

export async function login(formData: FormData) {
  const expected = process.env.DEMO_ADMIN_PASSWORD ?? ''
  const given = String(formData.get('password') ?? '')
  if (!passwordsMatch(given, expected)) redirect('/demo?error=1')

  const jar = await cookies()
  jar.set(DEMO_COOKIE, sessionToken(expected), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/demo',
    maxAge: 60 * 60 * 24 * 7,
  })
  redirect('/demo')
}

export async function logout() {
  const jar = await cookies()
  jar.set(DEMO_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/demo',
    maxAge: 0,
  })
  redirect('/demo')
}
