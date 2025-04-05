import {
  createContext,
  ReactNode,
  useState,
  useEffect,
  useContext,
} from "react";

import * as signalR from "@microsoft/signalr";

type RealTimeContextType = {
  connection: signalR.HubConnection | null;
};

const RealTimeContext = createContext<RealTimeContextType>({
  connection: null,
});

export const RealTimeContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );

  useEffect(() => {
    const connection_ = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7012/realtime", {
        transport:
          signalR.HttpTransportType.WebSockets |
          signalR.HttpTransportType.LongPolling,
      })
      .configureLogging(signalR.LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    connection_
      .start()
      .then(() => {
        setConnection(connection_);
      })
      .catch(() => {
        setConnection(null);
      });
  }, []);

  return (
    <RealTimeContext.Provider
      value={{
        connection,
      }}
    >
      {children}
    </RealTimeContext.Provider>
  );
};

export const useRealTime = () => {
  return useContext(RealTimeContext);
};
