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

- `/ping` - Replies with pong
- `/register <server>` - Registers a server by the ip address or hostname
- `/unregister <server>` - Unregisters a server by the ip address or hostname
- `/list` - Replies with a list of all registered servers
- `/status` - Replies with the current status of all registered servers
- `/subscribe <channel>` - Sets a channel to receive status updates
- `/unsubscribe <channel>` - Unsets a channel to receive status updates
