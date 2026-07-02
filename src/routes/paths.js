export const paths = {
  login: '/login',
  register: '/register',
  rooms: '/rooms',
  room: (roomId = ':roomId') => `/rooms/${roomId}`,
}
