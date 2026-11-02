import { handleSmsRequest } from '@/lib/lead-flow/handle-sms'
import { smsDeps } from '@/lib/lead-flow/runtime'

export async function POST(request: Request) {
  try {
    return await handleSmsRequest(request, smsDeps())
  } catch (error) {
    console.error('SMS webhook failed', error)
    return new Response('Server error', { status: 500 })
  }
}

export function GET() {
  return new Response('Method not allowed', { status: 405 })
}
