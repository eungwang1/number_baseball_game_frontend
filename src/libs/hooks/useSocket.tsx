import { useState, useEffect } from "react";
import { Socket, io } from "socket.io-client";

const useSocket = (serverUrl: string): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketIo = io(serverUrl);
    setSocket(socketIo);
    return () => {
      socketIo.disconnect();
    };
  }, [serverUrl]);

  return socket;
};

export default useSocket;
