import { useEffect, useState } from "react";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { getSignalRUrl } from "../../config";
import { useTtcDispatch, useTtcSelector } from "./storeHooks";
import { fetchPlayer } from "../../reducers/playersReducer";
import { fetchConfig } from "../../reducers/configReducer";
import { fetchClubs } from "../../reducers/clubsReducer";
import { fetchTeam } from "../../reducers/teamsReducer";
import { fetchMatch } from "../../reducers/matchesReducer";
import { fetchReadOnlyMatch } from "../../reducers/readonlyMatchesReducer";

enum Entities { // eslint-disable-line no-shadow
  Player,
  Match,
  Team,
  Club,
  Config,
  ReadOnlyMatch,
}

export const useSignalR = () => {
  const initialLoad = useTtcSelector(state => state.config.initialLoad);
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const dispatch = useTtcDispatch();

  useEffect(() => {
    if (initialLoad !== "done") {
      return;
    }

    const newConnection = new HubConnectionBuilder()
      .withUrl(getSignalRUrl(), {
        accessTokenFactory: () => localStorage.getItem('token') || '',
      })
      .configureLogging(LogLevel.Warning)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);
  }, [initialLoad]);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("SignalR Connected!");

          connection.on("BroadcastReload", (entityType: Entities, id: number) => {
            switch (entityType) {
              case Entities.Player:
                dispatch(fetchPlayer({id}));
                break;
              case Entities.Club:
                dispatch(fetchClubs());
                break;
              case Entities.Config:
                dispatch(fetchConfig());
                break;
              case Entities.Match:
                dispatch(fetchMatch({id}));
                break;
              case Entities.ReadOnlyMatch:
                dispatch(fetchReadOnlyMatch({id}));
                break;
              case Entities.Team:
                dispatch(fetchTeam({id}));
                break;
              default:
                console.warn(`BroadcastReload Unmapped!? ${entityType}: ${id}`);
            }
          });
        })
        .catch(err => console.error("Connection failed: ", err));
    }

    return () => {
      connection?.stop();
    };
  }, [connection]);

  return connection;
};
