import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { Op } from "sequelize";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import models from "../models";
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
      const emailExist = await models.User.findOne({ where: { email } });
      if (emailExist) return errorResponse(res, 409, "email already registered by another user.");
      const phoneExist = await models.User.findOne({ where: { phone } });
      if (phoneExist) return errorResponse(res, 409, "Phone already registered by another user.");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await models.User.create({
        username, firstname, lastname, email: Email, password: hashedPassword, phone
      });
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      await models.Otp.create({ email, token: otp, userId: user.id });
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
      const otp: IOtp | null = await models.Otp.findOne({ where: { token } });
      if (!otp) { return errorResponse(res, 404, "Otp does not exist."); }
      if (otp.expired) { return errorResponse(res, 409, "Otp has already been used."); }

      await models.User.update({ verified: true, active: true }, { where: { email: otp.email } });
      await models.Otp.update({ expired: true }, { where: { email: otp.email } });
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
      const user = await models.User.findOne({
        where: {
          [Op.or]: [{ email: username }, { username }]
        }
      });
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
      const token = await generateToken({ id, email, phone });
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
      const user = await models.User.findOne({ where: { id } });
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
      const {
        username, firstname, lastname
      } = req.body;
      if (!(req.body.username) || (req.body.firstname) || (req.body.lastname)) {
        return errorResponse(res, 400, "Only Username, firstname and lastname are required.");
      }
      // const user: IUser | null = await models.User.findOne({ where: { id } });
      // if (!user) return errorResponse(res, 404, "User not found.");
      await models.User.update({
        username,
        firstname,
        lastname
      },
      { where: { id } });
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
      const user = await models.User.findOne({ where: { email } });
      if (!user) {
        return errorResponse(res, 404, "Account does not exist!!!!!!");
      }
      const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
      await models.Otp.update({ token: otp, expired: false }, { where: { email } });
      const subject = "BETta password OTP reset";
      const message = `hi, kindly use this ${otp} to reset your password`;
      await sendEmail(email, subject, message);
      return successResponse(
        res,
        200,
        "Kindly use the otp in your mail to reset your password."
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
  static async reset(req: Request, res: Response) {
    try {
      const { token, password, retypePassword } = req.body;
      const otp = await models.Otp.findOne({ where: { token } });
      if (!otp) { return errorResponse(res, 404, "incorrect Otp"); }
      if (password !== retypePassword) {
        return errorResponse(res, 409, "Password mismatch.");
      }
      const hashedPassword = await bcrypt.hash(password, 10);
      await models.User.update({ password: hashedPassword }, { where: { email: otp.email } });
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
      const user = await models.User.findOne({ where: { id } });
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
  static async deactivateUser(req:Request, res: Response) {
    try {
      const { id } = req.user;
      const user = await models.User.findOne({ where: { id } });
      if (user?.active) {
        await user?.update({ active: false });
      }
      const otp = await models.Otp.findOne({ where: { email: user?.email } });
      if (otp) {
        await otp.destroy();
      }
      return successResponse(
        res,
        200,
        "User deactivated Successfully.",
        user
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
  static async reactivateUser(req:Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await models.User.findOne({ where: { email } });
      if (user) {
        const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
        await models.Otp.create({ email, token: otp, userId: user.id });
        const subject = "We are pleased to have you back at AlphaBET";
        const message = `<h1>BETta</h1>
        
        <p>To reactivate user, please confirm your email with this OTP</p>
        <p>${otp}</p>`;
        await sendEmail(email, subject, message);
      } else {
        return errorResponse(res, 409, "You have no business here");
      }
      return successResponse(
        res,
        200,
        "OTP Sent to your mail."
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
  static async welcomeBack(req: Request, res: Response) {
    try {
      const { otp } = req.body;
      const otpDey: IOtp | null = await models.Otp.findOne({ where: { token: otp } });
      console.log(otpDey?.email);
      const user = await models.User.findOne({ where: { email: otpDey?.email } });
      if (user) {
        user.active = true;
        await user.save();
      } else {
        return errorResponse(res, 400, "User not found");
      }
      return successResponse(res, 200, "Profile Picture updated Successfully.", user);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
