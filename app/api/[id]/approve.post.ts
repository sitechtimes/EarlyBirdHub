import { supabase } from "../../supabaseClient";

export default async function handleApprove(req, res) {
  const { id } = req.query;

  const { data: pending, error: fetchError } = await supabase
    .from("daily_links")
    .select("*")
    .eq("id", id)
    .single();

  if (fetchError) return res.status(400).json({ error: fetchError.message });

  if (pending.action_type === "create") {
    const { error: updateError } = await supabase
      .from("daily_links")
      .update({ status: "approved", is_live: true })
      .eq("id", id);

    if (updateError)
      return res.status(400).json({ error: updateError.message });
  } else if (pending.action_type === "edit") {
    const { error: updateError } = await supabase
      .from("daily_links")
      .update({
        title: pending.title,
        url: pending.url,
        description: pending.description,
        date: pending.date,
        image: pending.image,
      })
      .eq("id", pending.target_document_id);

    if (updateError)
      return res.status(400).json({ error: updateError.message });

    await supabase.from("daily_links").delete().eq("id", id);
  } else if (pending.action_type === "delete") {
    await supabase
      .from("daily_links")
      .delete()
      .eq("id", pending.target_document_id);
    await supabase.from("daily_links").delete().eq("id", id);
  }

  res.status(200).json({ message: "Action approved successfully" });
}
