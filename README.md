# PulseChat Frontend

Production-style React Vite frontend for a group chat app using HTTP for application data and EMQX MQTT over WebSocket for real-time messages.

## What is included

- React Vite project
- Route-based structure using `react-router-dom`
- Protected route middleware on the frontend
- Real login form that calls backend API, not hardcoded demo users
- Auth context with saved bearer token session
- Tidy HTTP utility in `src/services/http.js`
- Room management page
- Group chat window
- MQTT service using EMQX WebSocket
- Message history fetched through HTTP
- Live messages delivered through MQTT topic per room
- Responsive dark UI
- Dockerfile, Nginx config, and Docker Compose

## Install

```bash
npm install
cp .env.example .env
npm run dev
```

## Environment

```env
VITE_APP_NAME=PulseChat
VITE_API_BASE_URL=http://localhost:3000/api
VITE_MQTT_URL=ws://localhost:8083/mqtt
VITE_MQTT_USERNAME=
VITE_MQTT_PASSWORD=
VITE_MQTT_CLIENT_PREFIX=pulsechat-web
VITE_MQTT_TOPIC_PREFIX=chat/rooms
```

For browser frontend, MQTT must use WebSocket, for example:

```env
VITE_MQTT_URL=ws://localhost:8083/mqtt
```

For production with TLS, use WSS:

```env
VITE_MQTT_URL=wss://mqtt.your-domain.com/mqtt
```

## Frontend folder structure

```txt
src
├── app
│   └── App.jsx
├── components
│   └── ui
├── config
│   └── env.js
├── features
│   ├── auth
│   │   ├── context
│   │   ├── hooks
│   │   ├── pages
│   │   └── services
│   ├── chat
│   │   ├── components
│   │   ├── hooks
│   │   ├── pages
│   │   └── services
│   └── rooms
│       ├── context
│       ├── pages
│       └── services
├── layouts
├── routes
├── services
│   ├── http.js
│   └── mqttClient.js
└── utils
```

## Backend API contract expected by this frontend

### Login

`POST /auth/login`

Request:

```json
{
  "username": "belinda",
  "password": "secret"
}
```

Response:

```json
{
  "accessToken": "jwt-token",
  "refreshToken": "optional-refresh-token",
  "user": {
    "id": "user-1",
    "name": "Belinda",
    "username": "belinda",
    "email": "belinda@example.com",
    "avatarUrl": ""
  }
}
```

### Current user

`GET /auth/me`

Response:

```json
{
  "user": {
    "id": "user-1",
    "name": "Belinda",
    "username": "belinda",
    "email": "belinda@example.com",
    "avatarUrl": ""
  }
}
```

### Logout

`POST /auth/logout`

Can return `204 No Content` or JSON.

### List rooms

`GET /rooms`

Response:

```json
{
  "rooms": [
    {
      "id": "general",
      "name": "General",
      "description": "Main group chat",
      "memberCount": 4,
      "lastMessageAt": "2026-06-28T05:00:00.000Z",
      "createdAt": "2026-06-28T05:00:00.000Z"
    }
  ]
}
```

### Create room

`POST /rooms`

Request:

```json
{
  "name": "Backend Team",
  "description": "Backend development room"
}
```

Response can be either the room directly, `{ "room": {...} }`, or `{ "data": {...} }`.

### Delete room

`DELETE /rooms/:roomId`

Can return `204 No Content` or JSON.

### Message history

`GET /rooms/:roomId/messages`

Response:

```json
{
  "messages": [
    {
      "id": "msg-1",
      "roomId": "general",
      "type": "text",
      "content": "Hello",
      "createdAt": "2026-06-28T05:00:00.000Z",
      "sender": {
        "id": "user-1",
        "name": "Belinda",
        "username": "belinda",
        "avatarUrl": ""
      }
    }
  ]
}
```

## MQTT mechanism

Each room has a topic:

```txt
chat/rooms/{roomId}/messages
```

Example:

```txt
chat/rooms/general/messages
chat/rooms/backend-team/messages
```

When the user opens `/rooms/:roomId`, the frontend subscribes to that room topic. When the user sends a message, the frontend publishes JSON to the same topic.

Message payload:

```json
{
  "id": "msg-client-uuid",
  "roomId": "general",
  "type": "text",
  "content": "Hello everyone",
  "createdAt": "2026-06-28T05:00:00.000Z",
  "sender": {
    "id": "user-1",
    "name": "Belinda",
    "username": "belinda",
    "avatarUrl": ""
  }
}
```

For real production persistence, create a backend MQTT subscriber that listens to `chat/rooms/+/messages`, validates the sender/token, then saves the message to your database.

## Docker

```bash
docker compose up --build
```

The frontend is served by Nginx on port `80`.
