function readEnv(key, fallback = '') {
  return import.meta.env[key] || fallback
}

export const env = {
  appName: readEnv('VITE_APP_NAME', 'PulseChat'),
  apiBaseUrl: readEnv('VITE_API_BASE_URL', 'http://localhost:3000/api'),
  mqttUrl: readEnv('VITE_MQTT_URL', 'ws://localhost:8083/mqtt'),
  mqttUsername: readEnv('VITE_MQTT_USERNAME'),
  mqttPassword: readEnv('VITE_MQTT_PASSWORD'),
  mqttClientPrefix: readEnv('VITE_MQTT_CLIENT_PREFIX', 'pulsechat-web'),
  mqttTopicPrefix: readEnv('VITE_MQTT_TOPIC_PREFIX', 'chat/rooms'),
}
