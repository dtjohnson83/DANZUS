import { hanken, plexMono, saira } from './brand-fonts'

export default function NotFound() {
  return (
    <div
      className={hanken.className}
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#15181D',
        color: '#ECE6DA',
      }}
    >
      <h1
        className={saira.className}
        style={{
          fontSize: '96px',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '-0.005em',
          lineHeight: 1,
          marginBottom: '16px',
        }}
      >
        404
      </h1>
      <p style={{ color: '#6B7178', fontSize: '16px' }}>Page not found.</p>
      <a
        href="/"
        className={plexMono.className}
        style={{
          marginTop: '32px',
          color: '#F2A23C',
          fontSize: '11px',
          textTransform: 'uppercase',
          letterSpacing: '0.16em',
        }}
      >
        Return home
      </a>
    </div>
  )
}
