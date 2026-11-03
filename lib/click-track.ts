export type TrackHit = {
  name: string
  data?: Record<string, string>
}

const FIELDS = ['location', 'label', 'section', 'slug', 'url'] as const

function fields(el: Element) {
  const data: Record<string, string> = {}
  for (const key of FIELDS) {
    const value = el.getAttribute(`data-track-${key}`)
    if (value) data[key] = value
  }
  return data
}

/** Events for one delegated click on a `[data-track]` element. */
export function eventsFromTrackElement(el: Element): TrackHit[] {
  const name = el.getAttribute('data-track')
  if (!name) return []
  if (name === 'menu_open' && el.getAttribute('aria-expanded') === 'true') return []

  const data = fields(el)
  const href = el.getAttribute('href') || ''
  const hits: TrackHit[] = []

  if (name === 'menu_open') {
    return [{ name: 'menu_open' }]
  }

  if (name === 'call_click') {
    hits.push({ name: 'call_click', data: { location: data.location || 'section' } })
  } else if (name === 'text_click') {
    hits.push({ name: 'text_click', data: { location: data.location || 'section' } })
  } else if (name === 'cta_click') {
    hits.push({
      name: 'cta_click',
      data: { label: data.label || '', section: data.section || '' },
    })
  } else if (name === 'nav_click') {
    hits.push({
      name: 'nav_click',
      data: { label: data.label || '', location: data.location || 'nav' },
    })
  } else if (name === 'sample_open') {
    hits.push({ name: 'sample_open', data: { slug: data.slug || '' } })
  } else if (name === 'outbound_click') {
    hits.push({ name: 'outbound_click', data: { label: data.label || 'outbound' } })
  } else {
    hits.push({ name, data: Object.keys(data).length ? data : undefined })
  }

  if (name === 'cta_click' && href.startsWith('tel:')) {
    hits.push({ name: 'call_click', data: { location: data.location || data.section || 'section' } })
  }
  if (name === 'cta_click' && href.startsWith('sms:')) {
    hits.push({ name: 'text_click', data: { location: data.location || data.section || 'section' } })
  }
  if ((name === 'call_click' || name === 'text_click') && data.label) {
    hits.push({
      name: 'cta_click',
      data: { label: data.label, section: data.section || data.location || '' },
    })
  }

  return hits
}
