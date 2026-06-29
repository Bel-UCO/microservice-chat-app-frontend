import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../auth/hooks/useAuth.js'
import { roomApi } from '../services/roomApi.js'

const RoomsContext = createContext(null)

export function RoomsProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [rooms, setRooms] = useState([])
  const [isLoadingRooms, setIsLoadingRooms] = useState(false)
  const [roomsError, setRoomsError] = useState('')

  const fetchRooms = useCallback(async () => {
    if (!isAuthenticated) return

    setIsLoadingRooms(true)
    setRoomsError('')

    try {
      const roomList = await roomApi.listRooms()
      setRooms(roomList)
    } catch (err) {
      setRoomsError(err.message || 'Unable to load rooms.')
    } finally {
      setIsLoadingRooms(false)
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (isAuthenticated) {
      fetchRooms()
    } else {
      setRooms([])
    }
  }, [fetchRooms, isAuthenticated])

  const createRoom = useCallback(async (payload) => {
    const createdRoom = await roomApi.createRoom(payload)
    setRooms((current) => [createdRoom, ...current])
    return createdRoom
  }, [])

  const updateRoom = useCallback(async (roomId, payload) => {
    const updatedRoom = await roomApi.updateRoom(roomId, payload)
    setRooms((current) => current.map((room) => (room.id === roomId ? updatedRoom : room)))
    return updatedRoom
  }, [])

  const deleteRoom = useCallback(async (roomId) => {
    await roomApi.deleteRoom(roomId)
    setRooms((current) => current.filter((room) => room.id !== roomId))
  }, [])

  const value = useMemo(
    () => ({
      rooms,
      isLoadingRooms,
      roomsError,
      fetchRooms,
      createRoom,
      updateRoom,
      deleteRoom,
    }),
    [rooms, isLoadingRooms, roomsError, fetchRooms, createRoom, updateRoom, deleteRoom],
  )

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>
}

export function useRooms() {
  const context = useContext(RoomsContext)

  if (!context) {
    throw new Error('useRooms must be used inside RoomsProvider')
  }

  return context
}
