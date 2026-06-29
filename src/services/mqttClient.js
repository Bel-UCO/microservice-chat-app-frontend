import mqtt from 'mqtt'
import { env } from '../config/env.js'
import { createClientId } from '../utils/id.js'

export function createMqttClient({ user, accessToken }) {
  const username = env.mqttUsername || user?.username || user?.email || user?.id
  const password = env.mqttPassword || accessToken

  return mqtt.connect(env.mqttUrl, {
    clientId: createClientId(env.mqttClientPrefix),
    clean: true,
    connectTimeout: 8000,
    keepalive: 30,
    reconnectPeriod: 2000,
    username,
    password,
  })
}
