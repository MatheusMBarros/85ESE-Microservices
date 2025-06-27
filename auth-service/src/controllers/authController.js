// auth-service/src/controllers/authController.js
const User = require("../models/User");
const { generateToken } = require("../utils/jwt");

exports.register = async (req, res) => {
  const { username, password } = req.body;
console.log("entrou")
  try {
    let user = await User.findOne({ username });
    if (user) {
      return res.status(400).json({ msg: "Usuário já existe" });
    }

    user = new User({
      username,
      password,
    });

    await user.save();

    const token = generateToken({ id: user._id, username: user.username });
    res.status(201).json({ msg: "Usuário registrado com sucesso", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Credenciais inválidas" });
    }

    const token = generateToken({ id: user._id, username: user.username });
    res.json({ msg: "Login bem-sucedido", token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Erro no servidor");
  }
};
