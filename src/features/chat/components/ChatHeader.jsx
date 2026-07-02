import { ConnectionDot } from '../../../components/ui/ConnectionDot.jsx'

function statusLabel(status) {
  if (status === 'connected') return 'Live'
  if (status === 'connecting' || status === 'reconnecting') return 'Connecting'
  if (status === 'offline' || status === 'disconnected') return 'Offline'
  if (status === 'error') return 'Connection issue'
  return 'Preparing'
}

export function ChatHeader({ room, realtimeStatus, realtimeError, onRefresh }) {
  return (
    <header className="chat-header">
      <div>
        <p className="eyebrow">Group room</p>
        <h1>{room.name}</h1>
        <p>{room.description || 'No room description yet.'}</p>
      </div>
      <div className="chat-header-actions">
        <ConnectionDot status={realtimeStatus} label={statusLabel(realtimeStatus)} />
        <button className="button button-soft" type="button" onClick={onRefresh}>
          Refresh history
        </button>
        {realtimeError && <span className="mqtt-error">{realtimeError}</span>}
      </div>
    </header>
  )
}
