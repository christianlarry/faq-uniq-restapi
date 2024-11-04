import { generateChainlitToken, verifyChainlitToken } from "../services/chatbot-service.js";
// Controller untuk menghasilkan token dengan nilai default
const generateTokenController = (req, res) => {
  try {
    const identifier = req.body.identifier || "user-1";
    const metadata = req.body.metadata || { name: "John Doe" };

    const token = generateChainlitToken(identifier, metadata);
    res.status(200).json({ data:{token:token}});
  } catch (error) {
    console.error("Error generating token:", error);
    res.status(500).json({ message: "Error generating token" });
  }
};

// Controller untuk memverifikasi token
const verifyTokenController = (req, res) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: "Token diperlukan" });
    }

    const decoded = verifyChainlitToken(token);
    if (decoded) {
      res.status(200).json({ message: "Token valid", payload: decoded });
    } else {
      res.status(401).json({ message: "Token tidak valid atau sudah kadaluarsa" });
    }
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(500).json({ message: "Error verifying token" });
  }
};

export { generateTokenController, verifyTokenController };
