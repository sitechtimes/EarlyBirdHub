import { supabase } from "../supabaseClient";

export default async function handleDelete(req, res) {
  const { target_document_id } = req.body;

  const { data: original, error: fetchError } = await supabase
    .from("daily_links")
    .select("*")
    .eq("id", target_document_id)
    .single();

  if (fetchError) return res.status(400).json({ error: fetchError.message });

  const { data, error } = await supabase.from("daily_links").insert([
    {
      ...original,
      action_type: "delete",
      status: "pending",
      is_live: false,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ data });
}
