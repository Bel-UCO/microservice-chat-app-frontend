import { useMemo, useRef, useEffect } from 'react'
import { Navigate, useParams } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState.jsx'
import { useRooms } from '../../rooms/context/RoomsContext.jsx'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { useRoomMessages } from '../hooks/useRoomMessages.js'
import { useMqttRoom } from '../hooks/useMqttRoom.js'
import { ChatHeader } from '../components/ChatHeader.jsx'
import { MessageBubble } from '../components/MessageBubble.jsx'
import { MessageComposer } from '../components/MessageComposer.jsx'
import { paths } from '../../../routes/paths.js'

export default function ChatRoomPage() {
  const { roomId } = useParams()
  const { user } = useAuth()
  const { rooms, isLoadingRooms } = useRooms()
  const room = useMemo(() => rooms.find((item) => item.id === roomId), [roomId, rooms])
  const messagesEndRef = useRef(null)
  const { messages, isLoadingMessages, messagesError, fetchMessages, appendMessage } = useRoomMessages(roomId)
  const { status, error, topic, publishMessage } = useMqttRoom(roomId, appendMessage)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!isLoadingRooms && !room) {
    return <Navigate to={paths.rooms} replace />
  }

  if (!room) {
    return <section className="panel chat-panel"><p className="muted-text">Loading room...</p></section>
  }

  const isComposerDisabled = status !== 'connected'

  return (
    <section className="chat-panel">
      <ChatHeader
        mqttError={error}
        mqttStatus={status}
        onRefresh={fetchMessages}
        room={room}
        topic={topic}
      />

      {messagesError && <div className="alert alert-danger">{messagesError}</div>}

      <div className="message-list" aria-live="polite">
        {isLoadingMessages && <p className="muted-text">Loading messages...</p>}

        {!isLoadingMessages && messages.length === 0 && (
          <EmptyState
            title="No messages yet"
            description="Send the first message to this group room once MQTT is connected."
          />
        )}

        {messages.map((message) => (
          <MessageBubble
            isMine={String(message.sender.id) === String(user.id)}
            key={message.id}
            message={message}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <MessageComposer disabled={isComposerDisabled} onSend={publishMessage} />
    </section>
  )
}
