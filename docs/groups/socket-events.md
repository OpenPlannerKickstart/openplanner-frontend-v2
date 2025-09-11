# Groups Sockets v0.1

Rooms
- group:{id}

Client → Server
- group:sendMessage { groupId: UUID, clientId?: string, content: string }

Server → Client
- group:{id}:message
  - { id: UUID, groupId: UUID, sender: { id, name, avatar? }, content: string, createdAt: ISO8601, clientId?: string }
- group:{id}:typing
  - { userId: string, isTyping: boolean, at: ISO8601 }
- group:{id}:presence
  - { userId: string, state: "joined" | "left", at: ISO8601, memberCount: number }

Notes
- Join the room after successful REST join.
- Messages are authoritative (server assigns id and createdAt). Clients dedupe on clientId if present, otherwise on id.
- Throttle typing events (e.g., ≥1s between emits per user).

