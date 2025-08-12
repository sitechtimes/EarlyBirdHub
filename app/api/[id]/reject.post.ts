import { supabase } from "../../supabaseClient";

export default async function handleReject(req, res) {
  const { id } = req.query;

  const { error } = await supabase
    .from("daily_links")
    .update({ status: "rejected" })
    .eq("id", id);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ message: "Action rejected successfully" });
}
