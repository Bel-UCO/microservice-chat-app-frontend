import { Avatar } from '../../../components/ui/Avatar.jsx'
import { formatMessageTime } from '../../../utils/date.js'

export function MessageBubble({ message, isMine }) {
  return (
    <article className={`message-row ${isMine ? 'message-row-mine' : ''}`}>
      {!isMine && <Avatar name={message.sender.name} src={message.sender.avatarUrl} size="sm" />}
      <div className="message-bubble">
        <div className="message-meta">
          <strong>{isMine ? 'You' : message.sender.name}</strong>
          <span>{formatMessageTime(message.createdAt)}</span>
        </div>
        <p>{message.content}</p>
      </div>
    </article>
  )
}
