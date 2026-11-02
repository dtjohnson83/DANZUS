import { describe, expect, it } from 'vitest'
import { clients } from '@/lib/lead-flow/registry'
import { exampleSlots } from '@/lib/lead-flow/slots'

const config = clients[0]

describe('example slots', () => {
  it('offers the next three openings inside configured hours', () => {
    const afterClose = new Date('2026-11-04T18:00:00-08:00')
    expect(exampleSlots(config, afterClose)).toEqual([
      'Thu, Nov 5 at 8:00 AM',
      'Thu, Nov 5 at 12:00 PM',
      'Fri, Nov 6 at 8:00 AM',
    ])
  })

  it('skips a same-day opening that is less than two hours away', () => {
    const early = new Date('2026-11-05T07:00:00-08:00')
    expect(exampleSlots(config, early)).toEqual([
      'Thu, Nov 5 at 12:00 PM',
      'Fri, Nov 6 at 8:00 AM',
      'Fri, Nov 6 at 12:00 PM',
    ])
  })
})
