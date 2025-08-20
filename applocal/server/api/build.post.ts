const config = useRuntimeConfig();
const Url = config.public.backendUrl;
const BuildSecret = config.public.buildSecret || "false";
export default defineEventHandler(async (event) => {
  const response = await $fetch(`http://${Url}build`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${BuildSecret}`,
    },
  });

  return response;
});
