//import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { createAccessToken } from '../libs/jwt.js';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';


dotenv.config();

const supabaseUrl = 'https://emjgjuomqrvfhutsxlqh.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export const register = async (req, res) => {
    const {email, password, username} = req.body;

    try {
        const passwordHash = await bcryptjs.hash(password, 10);
        // Inserta el nuevo usuario en la base de datos de Supabase
        const { data, error } = await supabase
            .from('users')
            .insert([{ username, email, password: passwordHash}])
            .select()
            .single()

        if (error) {
            // Maneja errores de la operación de inserción
            console.error('Error:', error);
            return res.status(400).json({ error: error.message });
        }
        
        const token = await createAccessToken({id: data.id});

        res.cookie('token', token);
        res.json({
            id: data.id,
            username: data.username,
            email: data.email
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    const {email, password} = req.body;

    try {
        // Busca al usuario por el correo electrónico en Supabase
        const { data: users, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        
        if (error) {
            return res.status(400).json({ message: 'Error fetching user', error: error.message });
        }
    
        if (!users) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Compara la contraseña proporcionada con la almacenada
        const isMatch = await bcryptjs.compare(password, users.password);
        if(!isMatch) return res.status(400).json({message: "Incorrect password"});

        // Genera un token de acceso
        const token = await createAccessToken({ id: users.id });

        res.cookie('token', token);
        res.json({
            id: users.id,
            username: users.username,
            email: users.email
        })

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const logout = (req, res) => {
    res.cookie("token", "", {
        expires: new Date(0),
    });
    return res.sendStatus(200);
};

export const profile = async (req, res) => {
    const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', req.user.id)
        .select()
        .single();
    
    if (error) {
        return res.status(400).json({ message: 'Error fetching user', error: error.message });
    }
    
    if (!data) {
        return res.status(400).json({ message: 'User not found' });
    }

    //console.log(req.user);
    //res.send("Profile");
    return res.json({
        id: data.id,
        username: data.username,
        email: data.email
    })
};