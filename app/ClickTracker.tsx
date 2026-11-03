'use client'

import { track } from '@vercel/analytics'
import { useEffect } from 'react'
import { eventsFromTrackElement } from '@/lib/click-track'

/** One document click listener. Elements opt in with `data-track`. */
export function ClickTracker() {
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const node = event.target
      if (!(node instanceof Element)) return
      const source = node.closest('[data-track]')
      if (!source) return
      for (const hit of eventsFromTrackElement(source)) {
        track(hit.name, hit.data)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
