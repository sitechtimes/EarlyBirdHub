import { supabase } from "../supabaseClient";

export default async function handleEdit(req, res) {
  const { target_document_id, title, url, description, date, image } = req.body;

  const { data, error } = await supabase.from("daily_links").insert([
    {
      target_document_id,
      title,
      url,
      description,
      date,
      image,
      action_type: "edit",
      status: "pending",
      is_live: false,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ data });
}
