import { Request,Response } from "express";
import models from "../models"
import { successResponse, errorResponse, handleError } from "../utils/responses";

export default class NotificationController {
    /**
     * @param {object} req - The reset request object
     * @param {object} res - The reset errorResponse object
     * @returns {object} Success message
     */
    static async createNotification (req: Request, res: Response) {
        try {
            const { userId,title, message } = req.body;
            const user = await  models.User.findByPk(userId)
            if (!user) {
                return errorResponse(res, 409, "User not found")
        } 
        const notify = await models.Notification.create({
            owner : userId,
             title,
             message
        });
        return successResponse(res, 200, "Notification created successfully");
        } catch (error) {
            handleError(error, req);
            return errorResponse(res, 500, "Server error");
        }
    }
}
