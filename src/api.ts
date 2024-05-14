import ky from "ky";

const MC_STATUS_URL = process.env.MC_STATUS_URL;
if (!MC_STATUS_URL) {
  throw new Error("MC_STATUS_URL is not set");
}
const mcApi = ky.create({
  prefixUrl: MC_STATUS_URL,
  hooks: {
    beforeRequest: [
      (options) => {
        console.log("Requesting", options.url, options.method);
      },
    ],
  },
});

interface StatusResponse {
  online: boolean;
  host: string;
}

/**
 * Gets the status of a server
 * @param host The host of the server
 * @returns Either "online" or "offline"
 */
export async function getServerStatus(
  host: string,
): Promise<"online" | "offline"> {
  const status = await mcApi
    .get(`status/java/${host}?query=false`)
    .json<StatusResponse>();
  return status.online ? "online" : "offline";
}
