import { supabase } from "../supabaseClient";

export default async function handleGet(req, res) {
  const { view } = req.query;

  const filter =
    view === "admin"
      ? { status: "pending" }
      : { status: "approved", is_live: true };

  const { data, error } = await supabase
    .from("daily_links")
    .select("*")
    .match(filter);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ data });
}
