import { io } from 'socket.io-client'

const socket = io('http://localhost:8888', {autoConnect: false})

export default socket
