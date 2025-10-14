export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    interface PlaylistItem {
      snippet: {
        title: string;
        [key: string]: any;
      };
      [key: string]: any;
    }

    interface PlaylistResponse {
      items?: PlaylistItem[];
      [key: string]: any;
    }

    const data = await $fetch<PlaylistResponse>(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU&maxResults=10&key=${config.apiSecret}`
    );
    if (data.items) {
      data.items = data.items
        .filter((item: PlaylistItem) => item.snippet.title !== "Deleted video")
        .slice(0, 1);
    }
    return data;
  } catch (error) {
    throw createError({
      statusCode: 500,
      statusMessage: "Failed to fetch playlist data",
    });
  }
});
