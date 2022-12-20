import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import { errorResponse, handleError } from "../utils/responses";
import config from "../config";
import { ITokenDetails } from "../utils/interface";

class Authentication {
  /**
   * @param {object} req - The res body object
   * @param {object} res - The res body object
   * @param {object} next -  The function to call next
   * @returns {Function} errorResponse | next
   */
  static async verifyToken(req: Request, res: Response, next: NextFunction) {
    try {
      if (req.headers && req.headers.authorization) {
        const parts = req.headers.authorization.split(" ");
        if (parts.length === 2) {
          const scheme = parts[0];
          const credentials = parts[1];
          if (/^Bearer$/i.test(scheme)) {
            const token = credentials;
            const data = await jwt.verify(token, config.JWT_KEY as string) as ITokenDetails;
            const decoded = data;

            const user = await User.findOne({ where: { id: decoded.id } });
            if (!user) return errorResponse(res, 404, "User account not found");
            req.user = user;

            return next();
          }
        } else {
          return errorResponse(res, 401, "Invalid authorization format");
        }
      } else {
        return errorResponse(res, 401, "Authorization not found");
      }
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}

export default Authentication;
