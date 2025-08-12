import { defineStore } from "pinia";
import { ref } from "vue";
import { supabase } from "~/supabaseClient";

export const useAuthStore = defineStore("auth", () => {
  const user = ref<any>(null);

  async function signInWithEmail(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    if (error) {
      console.error("Error signing in:", error);
      return null;
    }
    user.value = data.user;
    return user.value;
  }

  async function manageLink(name: string, action_type: string, url?: string, description?: string, image?: File, oldID?: string) {
    try {   //needs testing
      if (image) {
        image = await addImgToBucket(image) as unknown as File;
      }
      const { data, error} = await supabase
      .from('daily-links')
      .insert({
        name: name, 
        action_type: action_type, 
        url: url? url : null, 
        description: description? description : null, 
        image: image? image : null, 
        oldID: oldID? oldID : null})
      .select()
      .single();
      return data;
      // stuff ---> whatever you want to do after the insert
  } catch (error) {
      console.error('Error managing link:', error);
  }
  }
  async function addImgToBucket(file: File) {
    try {   //needs testing - copilot wrote this
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      let { error: uploadError } = await supabase.storage
        .from('images')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('images').getPublicUrl(filePath);
      return data.publicUrl;
    }
  }
});
