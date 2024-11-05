import jwt from "jsonwebtoken";

const generateChainlitToken = (identifier, metadata) => {
  const secret = process.env.CHAINLIT_AUTH_SECRET;

  if (!secret) {
    throw new Error("Secret key untuk JWT tidak ditemukan.");
  }

  const payload = {
    identifier,
    ...metadata,
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 15, // Token berlaku selama 15 hari
  };

  const token = jwt.sign(payload, secret, { algorithm: "HS256" });

  console.log("Generated Token:", token); // Log token yang dihasilkan

  return token;
};

// Fungsi untuk memeriksa dan menampilkan informasi dari token
const verifyChainlitToken = (token) => {
  const secret = process.env.CHAINLIT_AUTH_SECRET;

  if (!secret) {
    throw new Error("Secret key untuk JWT tidak ditemukan.");
  }

  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    console.log("Token is valid. Payload:", decoded);
    return decoded; // Mengembalikan payload token yang sudah diverifikasi
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return null;
  }
};

export { generateChainlitToken, verifyChainlitToken };
