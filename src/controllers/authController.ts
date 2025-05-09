import { Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/User.model";
import TokenBlacklist from "../models/TokenBlackList.model";
import { generateAccessToken, generateRefreshToken } from "../utils/tokens";

interface IUser {
  _id: string;
}

export const signup = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }
    const user = new User({ email, passwordHash: password });
    await user.save();
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.status(201).json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });
    res.json({ accessToken });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  console.log(">>> Logout  refreshToken :", refreshToken);
  if (refreshToken) {
    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as unknown as any;
      const expiresAt = new Date(decoded.exp * 1000);
      await TokenBlacklist.create({ token: refreshToken, expiresAt });
    } catch (error) {
      console.error(">>> invalid token: ", error);
    }
  }
  res.clearCookie("refreshToken");
  res.json({ message: "Logged out successfully" });
};

export const refresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    return res.status(401).json({ message: "No refresh token" });
  }
  try {
    const blacklisted = await TokenBlacklist.findOne({ token: refreshToken });
    if (blacklisted) {
      return res.status(401).json({ message: "Token revoked" });
    }
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET!
    ) as { id: string };
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: "Invalid user" });
    }
    const accessToken = generateAccessToken(user._id);
    res.json({ accessToken });
  } catch (error) {
    res.status(401).json({ message: "Invalid refresh token" });
  }
};
