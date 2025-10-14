const fetch = require("node-fetch");

module.exports.handler = async function () {
  const apiKey = process.env.NUXT_API_SECRET;
  const playlistId = "PLXdwySAEBRBWocKBDaEE7HCw3rb3EvpeU";

  // Check if API key is available
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "YouTube API key not configured" }),
    };
  }

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${playlistId}&maxResults=10&key=${apiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();
    data.items = data.items.filter(
      (item) => !(item.snippet && item.snippet.title && item.snippet.title === "Deleted video")
    );
    data.items = data.items.length ? [data.items[0]] : [];

    // Check for YouTube API errors
    if (data.error) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: `YouTube API Error: ${data.error.message}`,
          details: data.error,
        }),
      };
    }

    if (!data.items || !data.items.length) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          error: "No videos found in playlist",
          playlistId: playlistId,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: `Network error: ${err.message}`,
        url: url.replace(apiKey, "[REDACTED]"), // Don't expose API key in logs
      }),
    };
  }
};
