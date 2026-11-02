import { demoClient } from '@/config/clients/demo'
import { parseClientConfig } from '@/lib/lead-flow/config'
import { phonesEqual } from '@/lib/lead-flow/phone'
import type { ClientConfig } from '@/lib/lead-flow/types'

/**
 * Active clients. Add a config file under config/clients and append it here.
 * Inbound calls and texts are handled only when `To` matches a registered
 * twilioNumber. Anything else is ignored and no SMS is sent.
 */
export const clients: ClientConfig[] = [parseClientConfig(demoClient)]

export function clientForInboundNumber(to: string): ClientConfig | undefined {
  return clients.find((client) => phonesEqual(client.twilioNumber, to))
}
