import jwt from 'jsonwebtoken';

// Rahasia untuk penandatanganan token
const CHAINLIT_AUTH_SECRET = "FY07_xol$4Y3p>Q1If?w1$=^~.1%DaAph:8xc,hi^7EurI3F7zSoOJ4FtAW9:Rn9";

// Fungsi untuk membuat token JWT
function createJwt(identifier, metadata) {
  const payload = {
    identifier,
    ...metadata,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // Token berlaku selama 15 hari
  };
  
  // Generate token
  const token = jwt.sign(payload, CHAINLIT_AUTH_SECRET, { algorithm: "HS256" });
  
  // Menampilkan token di logger
  console.log("Generated Token:", token);
  
  return token;
}

// Contoh penggunaan
const userIdentifier = "user-1";
const userMetadata = { name: "John Doe" };

// Panggil fungsi untuk menghasilkan token
createJwt(userIdentifier, userMetadata);
