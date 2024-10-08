import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import {
  db
} from "../application/database.js";
import {
  ResponseError
} from '../errors/response-error.js';
import { validate } from '../validations/validation.js';
import { loginValidation, registerValidation } from '../validations/user-validation.js';
import { ObjectId } from 'mongodb';

const login = async (email, password) => {
  const creds = validate(loginValidation,{email,password})

  const user = await db.collection('admin').findOne({
    email: creds.email
  });

  if (!user) {
    throw new ResponseError(400, 'Email not found');
  }

  if (!user.password) {
    throw new ResponseError(400, 'Password not set');
  }

  const isPasswordValid = await bcrypt.compare(creds.password, user.password);

  if (!isPasswordValid) {
    throw new ResponseError(400, 'Wrong password');
  }

  const payload = {
    id: user._id,
    username: user.username,
    email: user.email
  };

  const secret = process.env.JWT_SECRET;
  const expiresIn = 60 * 60 * 1; // Satu jam

  const token = jwt.sign(payload, secret, {
    expiresIn: expiresIn
  });

  return {
    token
  };
}

const register = async (username, email, password) => {
  const creds = validate(registerValidation,{username,email,password})

  // Cek apakah user sudah ada
  const isUserExist = await db.collection('admin').findOne({
    email: creds.email
  });

  if (isUserExist) {
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

const get = async ()=>{
  const user = await db.collection("admin").find().toArray()

  return user
}

const remove = async (id)=>{
  const isUserExist = await db.collection('admin').findOne({
    _id: new ObjectId(id)
  });

  if(!isUserExist) throw new ResponseError(400,"User not exist!")

  const result = db.collection("admin").deleteOne({
    _id: new ObjectId(id)
  })

  if(result.deletedCount === 0){
    throw new Error("Something happen when trying deleted user!")
  }
}

export default {
  login,
  register,
  remove,
  get
}