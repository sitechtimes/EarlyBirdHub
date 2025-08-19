const config = useRuntimeConfig();
const Url = config.public.url;
const BuildSecret = config.public.buildSecret || "false";
export default defineEventHandler(async (event) => {
  const response = await $fetch(`http://${Url}:3001/build`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BuildSecret}`,
    },
  });

  return response;
});
