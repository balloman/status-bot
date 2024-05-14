import { Client, Events, REST, Routes } from "discord.js";
import { COMMANDS } from "./commands";

console.log("Hello via Bun!");
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const DISCORD_CLIENT_ID = process.env.CLIENT_ID;
if (!DISCORD_TOKEN) {
  throw new Error("DISCORD_TOKEN is not set");
}
if (!DISCORD_CLIENT_ID) {
  throw new Error("CLIENT_ID is not set");
}

// Register commands
console.log("Registering commands...");
const restClient = new REST().setToken(DISCORD_TOKEN);
const response = await restClient.put(
  Routes.applicationCommands(DISCORD_CLIENT_ID),
  {
    body: COMMANDS.map((command) => command.command.toJSON()),
  },
);
console.log("Successfully registered commands, response:", response);
const client = new Client({ intents: ["Guilds"] });
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const startTime = Date.now();
  console.log("Received command:", interaction.commandName);
  const command = COMMANDS.find(
    (command) => command.command.name === interaction.commandName,
  );
  if (!command) {
    console.log("Unknown command:", interaction.commandName);
    return;
  }
  await command.onExecute(interaction);
  const endTime = Date.now();
  console.log("Command executed in", endTime - startTime, "ms");
});

client.login(DISCORD_TOKEN);
