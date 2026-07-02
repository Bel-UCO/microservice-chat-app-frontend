import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { EmptyState } from '../../../components/ui/EmptyState.jsx'
import { useRooms } from '../context/RoomsContext.jsx'
import { paths } from '../../../routes/paths.js'
import { formatRoomDate } from '../../../utils/date.js'

const initialRoomForm = {
  name: '',
  description: '',
}

export default function RoomsPage() {
  const navigate = useNavigate()
  const { rooms, isLoadingRooms, roomsError, createRoom, deleteRoom, fetchRooms } = useRooms()
  const [form, setForm] = useState(initialRoomForm)
  const [formError, setFormError] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [deletingRoomId, setDeletingRoomId] = useState('')

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setFormError('')

    if (!form.name.trim()) {
      setFormError('Room name is required.')
      return
    }

    setIsCreating(true)
    try {
      const room = await createRoom({
        name: form.name.trim(),
        description: form.description.trim(),
      })
      setForm(initialRoomForm)
      navigate(paths.room(room.id))
    } catch (err) {
      setFormError(err.message || 'Unable to create room.')
    } finally {
      setIsCreating(false)
    }
  }


  async function handleDeleteRoom(roomId) {
    const confirmed = window.confirm('Delete this room? Message history may also be removed.')
    if (!confirmed) return

    setDeletingRoomId(roomId)
    setFormError('')

    try {
      await deleteRoom(roomId)
    } catch (err) {
      setFormError(err.message || 'Unable to delete room.')
    } finally {
      setDeletingRoomId('')
    }
  }

  return (
    <div className="page-grid">
      <section className="panel room-create-panel">
        <div className="panel-heading">
          <p className="eyebrow">Room management</p>
          <h1>Create group chat room</h1>
          <p>Create a group space for your team conversations.</p>
        </div>

        {formError && <div className="alert alert-danger">{formError}</div>}

        <form className="stack-form" onSubmit={handleSubmit}>
          <label className="field-group">
            <span>Room name</span>
            <input
              name="name"
              onChange={handleChange}
              placeholder="Example: Backend Team"
              type="text"
              value={form.name}
            />
          </label>

          <label className="field-group">
            <span>Description</span>
            <textarea
              name="description"
              onChange={handleChange}
              placeholder="What is this group for?"
              rows="4"
              value={form.description}
            />
          </label>

          <button className="button button-primary" type="submit" disabled={isCreating}>
            {isCreating ? 'Creating...' : 'Create room'}
          </button>
        </form>
      </section>

      <section className="panel rooms-list-panel">
        <div className="panel-heading horizontal-heading">
          <div>
            <p className="eyebrow">Groups</p>
            <h2>Available rooms</h2>
          </div>
          <button className="button button-soft" type="button" onClick={fetchRooms} disabled={isLoadingRooms}>
            Refresh
          </button>
        </div>

        {roomsError && <div className="alert alert-danger">{roomsError}</div>}

        {isLoadingRooms && <p className="muted-text">Loading rooms...</p>}

        {!isLoadingRooms && rooms.length === 0 && (
          <EmptyState
            title="No room yet"
            description="Create your first group chat room from the form on the left."
          />
        )}

        <div className="room-card-list">
          {rooms.map((room) => (
            <article className="room-card" key={room.id}>
              <span className="room-card-icon">{room.name.slice(0, 1).toUpperCase()}</span>
              <span className="room-card-body">
                <strong>{room.name}</strong>
                <small>{room.description || 'No description'}</small>
                <em>Last active: {formatRoomDate(room.lastMessageAt)}</em>
              </span>
              <div className="room-card-actions">
                <span className="room-card-members">{room.memberCount} members</span>
                <Link className="button button-soft button-compact" to={paths.room(room.id)}>
                  Open
                </Link>
                <button
                  className="button button-danger button-compact"
                  disabled={deletingRoomId === room.id}
                  onClick={() => handleDeleteRoom(room.id)}
                  type="button"
                >
                  {deletingRoomId === room.id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}
