import { env } from '../config/env.js'

export function roomMessageTopic(roomId) {
  return `${env.mqttTopicPrefix}/${roomId}/messages`
}
