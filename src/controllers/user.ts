import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import User from "../models/user";
import jwtHelper from "../utils/jwt";

const { generateToken } = jwtHelper;

export default class UserController {
  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async createUser(req: Request, res: Response) {
    try {
      const {
        username, firstname, lastname, email, password, phone
      } = req.body;
      const Email = email.toLowerCase();
      const emailExist = await User.findOne({ where: { email } });
      if (emailExist) return errorResponse(res, 409, "email already registered by another user.");
      const phoneExist = await User.findOne({ where: { phone } });
      if (phoneExist) return errorResponse(res, 409, "Phone already registered by another user.");

      const hashedPassword = await bcrypt.hash(password, 10);
      await User.create({
        username, firstname, lastname, email: Email, password: hashedPassword, phone
      });
      return successResponse(res, 201, "Account created successfully, kindly verify your email and login.");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ where: { username } });
      if (!user) return errorResponse(res, 404, "username or email not found");
      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) return errorResponse(res, 404, "Password is not correct!.");

      const {
        id, firstname, lastname, email, phone
      } = user;
      const token = await generateToken({
        id, firstname, lastname, email, phone
      });
      const userDetails = {
        email, phone, username, firstname, lastname,
      };
      return successResponse(res, 200, "Logged in successfully", { userDetails, token });
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error.");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async updateProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const {
        username, firstname, lastname, phone
      } = req.body;
      const user = await User.findOne({ where: { id } });
      await user?.update({
        username, firstname, lastname, phone
      });
      await user?.save({
        fields: ["username", "firstname", "lastname", "phone"]
      });
      return successResponse(
        res,
        200,
        "Profile updated Successfully.",
        user
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
