import * as mcStatus from "node-mcstatus";

export function colorBlue(text: string) {
  return `\u001b[0;34m${text}\u001b[0m`;
}

export function colorRed(text: string) {
  return `\u001b[0;31m${text}\u001b[0m`;
}

export async function getServerStatus(
  host: string,
): Promise<"online" | "offline"> {
  const status = await mcStatus.statusJava(host, undefined, {
    query: false,
  });
  return status.online ? "online" : "offline";
}
