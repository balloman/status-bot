import {
  SlashCommandBuilder,
  type CacheType,
  type ChatInputCommandInteraction,
  type SharedSlashCommand,
} from "discord.js";
import { db } from "./db";
import { servers } from "./schema";

type CommandComponents = {
  command: SharedSlashCommand;
  onExecute: (
    interaction: ChatInputCommandInteraction<CacheType>,
  ) => Promise<void>;
};

export const COMMANDS: CommandComponents[] = [
  {
    command: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Replies with Pong!"),
    onExecute: async (interaction) => {
      await interaction.reply("Pong!");
    },
  },
  {
    command: new SlashCommandBuilder()
      .setName("register")
      .setDescription("Registers a server")
      .addStringOption((option) =>
        option
          .setName("server")
          .setDescription("Server IP or hostname")
          .setRequired(true),
      ),
    onExecute: async (interaction) => {
      const host = interaction.options.getString("server");
      if (!host) {
        await interaction.reply("Please provide a server hostname");
        return;
      }
      await db.insert(servers).values({
        host,
      });
      await interaction.reply("Registered server!");
    },
  },
];
