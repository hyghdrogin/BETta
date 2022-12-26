import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import User from "../models/user";
import Otp from "../models/otp";
import jwtHelper from "../utils/jwt";
import sendEmail from "../utils/email";
import { IOtp } from "../utils/interface";

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
      const user = await User.create({
        username, firstname, lastname, email: Email, password: hashedPassword, phone
      });
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      await Otp.create({ email, token: otp, userId: user.id });
      const subject = "User created";
      const message = `hi, thank you for signing up kindly verify your account with this token ${otp}`;
      await sendEmail(email, subject, message);
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
  static async verifyAccount(req: Request, res: Response) {
    try {
      const { token } = req.body;
      const otp: IOtp | null = await Otp.findOne({ where: { token } });
      if (!otp) { return errorResponse(res, 404, "Otp does not exist."); }
      if (otp.expired) { return errorResponse(res, 409, "Otp has already been used."); }

      await User.update({ verified: true, active: true }, { where: { email: otp.email } });
      await Otp.update({ expired: true }, { where: { email: otp.email } });
      return successResponse(
        res,
        200,
        "Account verified successfully kindly login."
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
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
      if (!user.verified) {
        return errorResponse(res, 409, "Kindly verify your account before logging in.");
      }
      if (user.active === false) {
        return errorResponse(res, 409, "Account deactivated. Please contact admin.");
      }
      const validpass = await bcrypt.compare(password, user.password);
      if (!validpass) return errorResponse(res, 404, "Password is not correct!.");

      const {
        id, firstname, lastname, email, phone
      } = user;
      const token = await generateToken({
        id, firstname, lastname, email, phone
      });
      const userDetails = {
        id, email, phone, username, firstname, lastname,
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
  static async getProfile(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const user = await User.findOne({ where: { id } });
      return successResponse(res, 200, "User fetched successfully", user);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
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
      if (req.body.password) {
        req.body.password = await bcrypt.hash(req.body.password, 10);
      }
      if (req.body.email || req.body.phone || req.body.username) {
        return errorResponse(res, 400, "Invalid Input");
      }
      await User.update(req.body, { where: { id } });
      return successResponse(
        res,
        200,
        "Profile updated Successfully."
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async recover(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await User.findOne({ where: { email } });
      if (!user) return errorResponse(res, 404, "Email does not exist!!!!!!");
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      await Otp.update({ token: otp, expired: false }, { where: { email } });
      const subject = "Reset Password Otp";
      const message = `hi, kindly use this ${otp} to reset your password`;
      await sendEmail(email, subject, message);
      return successResponse(res, 200, "Kindly use the otp in your mail to reset your password.");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async reset(req: Request, res: Response) {
    try {
      const { token, password, retypePassword } = req.body;
      const otp = await Otp.findOne({ where: { token } });
      if (!otp) { return errorResponse(res, 404, "incorrect Otp"); }
      if (password !== retypePassword) {
        return errorResponse(res, 409, "Password mismatch.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await User.update({ password: hashedPassword }, { where: { email: otp.email } });
      return successResponse(res, 200, "Password reset successfully, Kindly login.");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async uploadProfilePicture(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const user = await User.findOne({ where: { id } });
      await user?.update(
        { photo: req.file?.path }
      );
      return successResponse(res, 200, "Picture uploaded Successfully.", user);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async deleteUser(req:Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      const token = await Otp.findOne({ where: { userId } });
      await token?.destroy();
      user?.destroy();
      return successResponse(
        res,
        200,
        "User Deleted Successfully."
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
   * @param {object} req - The reset request object
   * @param {object} res - The reset errorResponse object
   * @returns {object} Success message
   */
  static async deactivateUser(req:Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await User.findByPk(userId);
      await user?.update({ active: false }, { where: { userId } });
      const token = await Otp.findOne({ where: { userId } });
      await token?.destroy();
      return successResponse(
        res,
        200,
        "User deactivated SSuccessfully.",
        user
      );
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
