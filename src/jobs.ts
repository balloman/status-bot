import { ChannelType, type Channel, type Client } from "discord.js";
import { eq } from "drizzle-orm";
import { getServerStatus } from "./api";
import { db } from "./db";
import { servers } from "./schema";

export function startStatusUpdateJob(client: Client) {
  console.log("Starting status update job...");
  setInterval(async () => {
    await updateStatuses(client).catch(console.error);
  }, 10000);
}

async function updateStatuses(client: Client) {
  console.log("Updating statuses...");
  const startTime = Date.now();
  const serversQuery = await db.query.servers.findMany();
  const statuses = await Promise.all(
    serversQuery.map(async (server) => {
      const status = await getServerStatus(server.host);
      const isNowOnline = status === "online";
      const updated = isNowOnline !== server.wasOnline;
      return {
        host: server.host,
        currentStatus: isNowOnline,
        hasNewStatus: updated,
      };
    }),
  );
  if (!statuses.some((status) => status.hasNewStatus)) {
    console.log("No new statuses found");
    return;
  }
  console.log("Statuses:", statuses);
  await db.transaction(async (tx) => {
    for (const status of statuses) {
      await tx
        .update(servers)
        .set({
          wasOnline: status.currentStatus,
        })
        .where(eq(servers.host, status.host));
    }
  });
  console.log("DB updated!");
  const channels = await db.query.channels.findMany();
  const allChannels = await Promise.all(
    channels.map(async (channel) => {
      const channelObject = await client.channels.fetch(channel.id);
      if (!channelObject) {
        return null;
      }
      return channelObject;
    }),
  );

  const notNullChannels = allChannels
    .filter((channel) => channel !== null)
    .map((channel) => channel as Channel);
  console.log(
    "Channels:",
    notNullChannels.map((channel) => channel.id),
  );
  for (const status of statuses) {
    if (!status.hasNewStatus) continue;
    for (const channel of notNullChannels) {
      if (channel.type !== ChannelType.GuildText) continue;
      if (status.currentStatus) {
        await channel.send(`${status.host} is now online`);
      } else {
        await channel.send(`${status.host} is now offline`);
      }
    }
  }
  console.log("Statuses updated!", Date.now() - startTime, "ms");
}
