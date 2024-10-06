import authService from "../services/auth-service.js"; // Pastikan ada '.js' di jalur impor

const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const result = await authService.login(email, password);

    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e)
  }
};

const register = async (req, res, next) => {
  try {
    const {
      email,
      password,
      username
    } = req.body;

    const result = await authService.register(username, email, password);

    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}


export default {
  login,
  register
}