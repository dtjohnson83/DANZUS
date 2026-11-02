import { handleVoiceRequest } from '@/lib/lead-flow/handle-voice'
import { voiceDeps } from '@/lib/lead-flow/runtime'

export async function POST(request: Request) {
  try {
    return await handleVoiceRequest(request, voiceDeps())
  } catch (error) {
    console.error('Voice webhook failed', error)
    return new Response('Server error', { status: 500 })
  }
}

export function GET() {
  return new Response('Method not allowed', { status: 405 })
}
