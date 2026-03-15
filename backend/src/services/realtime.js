let ioInstance = null;

export function registerSocketHandlers(io) {
  ioInstance = io;

  io.on('connection', (socket) => {
    const kioskId = socket.handshake.query.kioskId;
    if (kioskId) {
      socket.join(`kiosk:${kioskId}`);
    }

    const isAdmin = socket.handshake.query.role === 'admin';
    if (isAdmin) {
      socket.join('admins');
    }

    socket.on('disconnect', () => {
      // Cleanup if needed
    });
  });
}

export function emitToKiosk(kioskId, event, payload) {
  if (!ioInstance) return;
  ioInstance.to(`kiosk:${kioskId}`).emit(event, payload);
}

export function emitToAdmins(event, payload) {
  if (!ioInstance) return;
  ioInstance.to('admins').emit(event, payload);
}

