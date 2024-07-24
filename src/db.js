import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = 'https://emjgjuomqrvfhutsxlqh.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const connectDB = async () => {
  try {
    // Realiza una consulta simple para verificar la conexión
    const { data, error } = await supabase
      .from('products') // Reemplaza 'your_table_name' con el nombre de una tabla existente en tu base de datos
      .select('*')
      .limit(1);

    if (error) {
      throw error;
    }
    
    console.log(">>> DB is connected");
  } catch (error) {
    console.log("Failed to connect to DB:", error.message);
  }
};