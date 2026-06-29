export const paths = {
  login: '/login',
  rooms: '/rooms',
  room: (roomId = ':roomId') => `/rooms/${roomId}`,
}
