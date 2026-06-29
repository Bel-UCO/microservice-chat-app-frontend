import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createMqttClient } from '../../../services/mqttClient.js'
import { roomMessageTopic } from '../../../utils/topic.js'
import { createClientId } from '../../../utils/id.js'
import { useAuth } from '../../auth/hooks/useAuth.js'

export function useMqttRoom(roomId, onIncomingMessage) {
  const { user, accessToken } = useAuth()
  const clientRef = useRef(null)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')
  const topic = useMemo(() => (roomId ? roomMessageTopic(roomId) : ''), [roomId])

  useEffect(() => {
    if (!roomId || !accessToken) return undefined

    setStatus('connecting')
    setError('')

    const client = createMqttClient({ user, accessToken })
    clientRef.current = client

    client.on('connect', () => {
      setStatus('connected')
      client.subscribe(topic, { qos: 1 }, (subscribeError) => {
        if (subscribeError) {
          setError(subscribeError.message)
          setStatus('error')
        }
      })
    })

    client.on('reconnect', () => setStatus('reconnecting'))
    client.on('offline', () => setStatus('offline'))
    client.on('close', () => setStatus((current) => (current === 'idle' ? current : 'disconnected')))
    client.on('error', (mqttError) => {
      setError(mqttError.message)
      setStatus('error')
    })

    client.on('message', (receivedTopic, payload) => {
      if (receivedTopic !== topic) return

      try {
        const message = JSON.parse(payload.toString())
        onIncomingMessage(message)
      } catch {
        setError('Received invalid MQTT message payload.')
      }
    })

    return () => {
      client.unsubscribe(topic)
      client.end(true)
      clientRef.current = null
      setStatus('idle')
    }
  }, [accessToken, onIncomingMessage, roomId, topic, user])

  const publishMessage = useCallback(
    async (content) => {
      if (!clientRef.current || status !== 'connected') {
        throw new Error('MQTT is not connected yet.')
      }

      const message = {
        id: createClientId('msg'),
        roomId,
        type: 'text',
        content,
        createdAt: new Date().toISOString(),
        sender: {
          id: user.id,
          name: user.name,
          username: user.username,
          avatarUrl: user.avatarUrl,
        },
      }

      await new Promise((resolve, reject) => {
        clientRef.current.publish(topic, JSON.stringify(message), { qos: 1 }, (publishError) => {
          if (publishError) reject(publishError)
          else resolve()
        })
      })

      return message
    },
    [roomId, status, topic, user],
  )

  return {
    status,
    error,
    topic,
    publishMessage,
  }
}
