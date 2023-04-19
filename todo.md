# TODO

## Left-off

- Working on `in-game-window.component.ts` to connect to the websocket server

## Lingering Questions

- (future) How do we authenticate users? (possibly apexlegendsapi.com)
  - Until then, we will use PlatformID or OriginID
- (future) How do we handle matchmaking?
  - Until then, we will use a queue system

## API Server

    GET     /user/              - (get user information + lvl)
    GET     /raw-games/lobbies/           -
    POST    /raw-games/lobby/             - (create a new lobby)

## Websocket Server

    JOIN matchmaking queue      - (future)
    JOIN lobby {LOBBYID}        -
        LIST users              -
        START match             -
        LEAVE lobby             -

## Organizer Flow (client)

    load lobbies (GET)
    create new lobby (POST)
    join created lobby (WSS)
        - list players in lobby
        - start match
        - close lobby

## Player Flow (client)

    load lobbies (GET)
    join lobby (WSS)
        - list players in lobby
        - listen for match start
        - leave lobby
