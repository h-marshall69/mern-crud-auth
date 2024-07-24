import Joi from 'joi';

// Define el esquema de validación para un usuario
const userSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});
class User {
    constructor({ username, email, password }) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    static validate(user) {
        return userSchema.validate(user);
    }

    async save() {
        const { data, error } = await supabase
          .from('users')
          .insert([{ username: this.username, email: this.email, password: this.password }]);
    
        if (error) {
          throw error;
        }
        return data;
    }
    
      static async findByEmail(email) {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('email', email)
          .single();
    
        if (error) {
          throw error;
        }
        return data;
    }
}

export default User;


/*import mongoose, { mongo } from "mongoose";

const userShema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true
    },
    email: {
        type: String,
        require: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    }
});

export default mongoose.model('user', userShema);*/