import {
  ChannelType,
  SlashCommandBuilder,
  type CacheType,
  type ChatInputCommandInteraction,
  type SharedSlashCommand,
} from "discord.js";
import { eq } from "drizzle-orm";
import { db } from "./db";
import { channels, servers } from "./schema";
import { colorBlue, colorRed, getServerStatus } from "./utils";

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
      await interaction.reply(`Registered server ${host}!`);
    },
  },
  {
    command: new SlashCommandBuilder()
      .setName("list")
      .setDescription("Replies with a list of all registered servers"),
    onExecute: async (interaction) => {
      const servers = await db.query.servers.findMany();
      await interaction.reply(
        `Registered servers:\n${servers
          .map((server) => server.host)
          .join("\n")}`,
      );
    },
  },
  {
    command: new SlashCommandBuilder()
      .setName("unregister")
      .setDescription(
        "Unregisters a server, this command succeeds even if the server is not registered",
      )
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
      await db.delete(servers).where(eq(servers.host, host));
      await interaction.reply(`Unregistered server ${host}!`);
    },
  },
  {
    command: new SlashCommandBuilder()
      .setName("status")
      .setDescription(
        "Replies with the current status of all registered servers",
      ),
    onExecute: async (interaction) => {
      await interaction.deferReply();
      const servers = await db.query.servers.findMany();
      console.log("Servers:", servers);
      const statuses = await Promise.all(
        servers.map(async (server) => {
          const status = await getServerStatus(server.host);
          return {
            host: server.host,
            status,
          };
        }),
      );
      const statusesString = `\`\`\`ansi\n${statuses
        .map(
          (status) =>
            `${status.host}: ${
              status.status === "online"
                ? colorBlue("online")
                : colorRed("offline")
            }`,
        )
        .join("\n")}\n\`\`\``;
      await interaction.editReply(statusesString);
    },
  },
  {
    command: new SlashCommandBuilder()
      .setName("subscribe")
      .setDescription("Sets a channel to receive status updates")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel to subscribe to")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText),
      ),
    onExecute: async (interaction) => {
      const channel = interaction.options.getChannel("channel");
      if (!channel) {
        await interaction.reply("Please provide a channel");
        return;
      }
      await db
        .insert(channels)
        .values({
          id: channel.id,
        })
        .onConflictDoNothing();
      await interaction.reply(`Subscribed to channel ${channel.name}!`);
    },
  },
  {
    command: new SlashCommandBuilder()
      .setName("unsubscribe")
      .setDescription("Unsets a channel to receive status updates")
      .addChannelOption((option) =>
        option
          .setName("channel")
          .setDescription("Channel to unsubscribe from")
          .setRequired(true)
          .addChannelTypes(ChannelType.GuildText),
      ),
    onExecute: async (interaction) => {
      const channel = interaction.options.getChannel("channel");
      if (!channel) {
        await interaction.reply("Please provide a channel");
        return;
      }
      await db.delete(channels).where(eq(channels.id, channel.id));
      await interaction.reply(`Unsubscribed from channel ${channel.name}!`);
    },
  },
];
