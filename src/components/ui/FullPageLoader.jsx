export function FullPageLoader({ label = 'Loading' }) {
  return (
    <main className="loader-page">
      <div className="loader-card">
        <span className="loader-spinner" />
        <p>{label}</p>
      </div>
    </main>
  )
}
