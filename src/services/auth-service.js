import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from "../application/database.js"; 
import { ResponseError } from '../errors/response-error.js';

const login = async (email, password) => {
    const user = await db.collection('admin').findOne({ email: email });

    if (!user) {
        throw new ResponseError(400,'User not found');
    }

    if (!user.password) {
        throw new ResponseError(400,'Password not set');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new ResponseError(400,'Wrong password');
    }

    const payload = {
        id: user._id,
        username: user.username,
        email: user.email
    };

    const secret = process.env.JWT_SECRET;
    const expiresIn = 60 * 60 * 1; // Satu jam

    const token = jwt.sign(payload, secret, { expiresIn: expiresIn });

    return {
      token
    };
}

const register = async (username, email, password) => {
    // Cek apakah user sudah ada
    const existingUser = await db.collection('admin').findOne({ email: email });
    
    if (existingUser) {
        throw new ResponseError(400, 'Email already exists');
    }

    // Hash password menggunakan bcrypt
    const hashedPassword = await bcrypt.hash(password, 10);

    // Buat object user baru
    const newUser = {
        username: username,
        email: email,
        password: hashedPassword
    };

    // Simpan user ke database
    const result = await db.collection('admin').insertOne(newUser);

    // Return hasil
    return {
        inserted_id: result.insertedId
    };
};

export default{ 
  login,
  register
}