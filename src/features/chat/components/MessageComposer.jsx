import { useState } from 'react'

export function MessageComposer({ disabled, onSend }) {
  const [content, setContent] = useState('')
  const [error, setError] = useState('')
  const [isSending, setIsSending] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')

    const nextContent = content.trim()

    if (!nextContent) {
      setError('Message cannot be empty.')
      return
    }

    setIsSending(true)
    try {
      await onSend(nextContent)
      setContent('')
    } catch (err) {
      setError(err.message || 'Unable to send message.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <form className="composer" onSubmit={handleSubmit}>
      {error && <div className="alert alert-danger composer-error">{error}</div>}
      <div className="composer-bar">
        <input
          disabled={disabled || isSending}
          onChange={(event) => setContent(event.target.value)}
          placeholder={disabled ? 'MQTT is connecting...' : 'Type a message...'}
          type="text"
          value={content}
        />
        <button className="button button-primary" disabled={disabled || isSending} type="submit">
          {isSending ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  )
}
