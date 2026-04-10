export default function NotFound() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0b0907',
      color: '#f5ecda',
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <h1 style={{
        fontFamily: "'Barlow Condensed', sans-serif",
        fontSize: '96px',
        fontWeight: 700,
        textTransform: 'uppercase',
        letterSpacing: '-0.005em',
        lineHeight: 1,
        marginBottom: '16px',
      }}>
        404
      </h1>
      <p style={{ color: '#6f6657', fontSize: '16px' }}>Page not found.</p>
      <a href="/" style={{
        marginTop: '32px',
        color: '#d4a853',
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: '11px',
        textTransform: 'uppercase',
        letterSpacing: '0.16em',
      }}>
        Return home
      </a>
    </div>
  )
}
