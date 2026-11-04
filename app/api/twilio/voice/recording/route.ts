import { handleRecordingRequest } from '@/lib/lead-flow/handle-recording'
import { recordingDeps } from '@/lib/lead-flow/runtime'

export async function POST(request: Request) {
  try {
    return await handleRecordingRequest(request, recordingDeps())
  } catch (error) {
    console.error('Recording webhook failed', error)
    return new Response('Server error', { status: 500 })
  }
}

export function GET() {
  return new Response('Method not allowed', { status: 405 })
}
