import { users } from "../models/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken";

export async function register(req, res) {
  try {
    const { name, email, password } = req.body;

    const userExists = await users.findOne({ email });

    if (userExists) {
      return res
        .status(400)
        .json({ success: "False", message: "User already exists" });
    }

    const hashedPass = bcrypt.hash(password, 10);

    const user = await users.create({ name, email, hashedPass });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function login(req, res) {
  try {
    const { email, passowrd } = req.body;

    const user = await users.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isPasswordCorrect = bcrypt.compare(passowrd, user.password);

    if (!isPasswordCorrect)
      return res.status(401).json({ message: "Invalid email or password" });

    const token = generateToken(user._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export async function logout(req, res) {
  res.cookie("token", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ message: "Logged out successfully" });
}

export async function getMe(req, res) {
  res.json(req.user);
}
