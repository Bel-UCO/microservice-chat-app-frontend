export function EmptyState({ title, description, action }) {
  return (
    <section className="empty-state">
      <div className="empty-illustration">⌁</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {action}
    </section>
  )
}
