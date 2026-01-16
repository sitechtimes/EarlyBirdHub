export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();

  try {
    const data = await $fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU&maxResults=10&key=${config.apiSecret}`
    );
    if (data.items) {
      data.items = data.items
        .filter(item => item.snippet.title !== "Deleted video")
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
