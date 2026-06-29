import { useCallback, useEffect, useState } from 'react'
import { messageApi } from '../services/messageApi.js'

export function useRoomMessages(roomId) {
  const [messages, setMessages] = useState([])
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [messagesError, setMessagesError] = useState('')

  const appendMessage = useCallback((message) => {
    setMessages((current) => {
      const alreadyExists = current.some((item) => item.id === message.id)
      if (alreadyExists) return current
      return [...current, message].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    })
  }, [])

  const fetchMessages = useCallback(async () => {
    if (!roomId) return

    setIsLoadingMessages(true)
    setMessagesError('')

    try {
      const messageList = await messageApi.listMessages(roomId)
      setMessages(messageList)
    } catch (err) {
      setMessagesError(err.message || 'Unable to load room messages.')
    } finally {
      setIsLoadingMessages(false)
    }
  }, [roomId])

  useEffect(() => {
    setMessages([])
    fetchMessages()
  }, [fetchMessages])

  return {
    messages,
    isLoadingMessages,
    messagesError,
    fetchMessages,
    appendMessage,
  }
}
