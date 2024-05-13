# status-bot

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.1.6. [Bun](https://bun.sh) is a fast all-in-one JavaScript runtime.

## Commands

- `@StatusBot help` - Shows a list of commands
- `@StatusBot ping` - Replies with pong
- `@StatusBot register <server>` - Registers a server by the ip address or hostname
- `@StatusBot unregister <server>` - Unregisters a server by the ip address or hostname
- `@StatusBot list` - Replies with a list of all registered servers
- `@StatusBot status` - Replies with the current status of all registered servers
- `@StatusBot subscribe <channel>` - Sets a channel to receive status updates
- `@StatusBot unsubscribe <channel>` - Unsets a channel to receive status updates
