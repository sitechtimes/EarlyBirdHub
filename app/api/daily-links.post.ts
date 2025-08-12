import { supabase } from "../supabaseClient";

export default async function handleCreate(req, res) {
  const { title, url, description, date } = req.body;
  const imageFile = req.files?.image; // Assuming the file is sent as 'image'

  let imageUrl = null;

  if (imageFile) {
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images") // Replace 'images' with your Supabase storage bucket name
      .upload(`daily-links/${Date.now()}_${imageFile.name}`, imageFile.data, {
        contentType: imageFile.mimetype,
      });

    if (uploadError)
      return res.status(400).json({ error: uploadError.message });

    imageUrl = supabase.storage.from("images").getPublicUrl(uploadData.path)
      .data.publicUrl;
  }

  const { data, error } = await supabase.from("daily_links").insert([
    {
      title,
      url,
      description,
      date,
      image: imageUrl,
      action_type: "create",
      status: "pending",
      is_live: false,
    },
  ]);

  if (error) return res.status(400).json({ error: error.message });
  res.status(200).json({ data });
}
