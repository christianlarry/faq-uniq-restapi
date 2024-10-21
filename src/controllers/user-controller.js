import userService from "../services/user-service.js"; // Pastikan ada '.js' di jalur impor

const login = async (req, res, next) => {
  try {
    const {
      email,
      password
    } = req.body;

    const result = await userService.login(email, password);

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

    const result = await userService.register(username, email, password);

    res.status(200).json({
      data: result
    });
  } catch (e) {
    next(e);
  }
}

const get = async (req,res,next)=>{
  try {
    const result = await userService.get()

    res.status(200).json({
      data: result
    })
  } catch (err) {
    next(err)
  }
}

const remove = async (req,res,next)=>{
  try {
    await userService.remove(req.params.id)

    res.status(200).json({
      data: "ok"
    })
  } catch (err) {
    next(err)
  }
}

const checkToken = async (req,res)=>{
  res.status(200).json({
    data: "ok"
  })
}


export default {
  login,
  register,
  remove,
  get,
  checkToken
}