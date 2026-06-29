import { ConnectionDot } from '../../../components/ui/ConnectionDot.jsx'

export function ChatHeader({ room, mqttStatus, mqttError, topic, onRefresh }) {
  return (
    <header className="chat-header">
      <div>
        <p className="eyebrow">Group room</p>
        <h1>{room.name}</h1>
        <p>{room.description || 'No room description yet.'}</p>
        <code className="topic-chip">{topic}</code>
      </div>
      <div className="chat-header-actions">
        <ConnectionDot status={mqttStatus} label={`MQTT ${mqttStatus}`} />
        <button className="button button-soft" type="button" onClick={onRefresh}>
          Refresh history
        </button>
        {mqttError && <span className="mqtt-error">{mqttError}</span>}
      </div>
    </header>
  )
}
