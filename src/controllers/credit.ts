import { Request, Response } from "express";
import models from "../models";
import { successResponse, errorResponse, handleError } from "../utils/responses";
import Payment from "../middlewares/paystack";
import sendEmail from "../utils/email";

const { initializePayment, verifyPayment } = Payment;
/**
 * @class CreditController
 * @description initializing payment, verifying payment, get, Transaction
 * @exports CreditController
 */
export default class CreditController {
  /**
 * @param {object} req - The reset request object
 * @param {object} res - The reset errorResponse object
 * @returns {object} Success message
 */
  static async createTransaction(req: Request, res: Response) {
    try {
      const { id } = req.user;
      const { amount } = req.body;
      const user = await models.User.findOne({ where: { id } });
      if (!user) { return errorResponse(res, 404, "User not found"); }
      if (Number.isNaN(Number(amount)) || Number(amount) <= 0) {
        return errorResponse(res, 422, "Invalid amount.");
      }

      const transaction = await models.Credit.create({
        amount,
        receiver: id,
        sender: id,
        type: "Bank-transfer"
      });

      const paystack_data = {
        amount: amount * 100,
        email: user.email,
        metadata: {
          name: `${user.firstname} ${user.lastname} `,
          userId: id,
          transactionId: transaction.id,
        },
      };
      const paymentDetails = await initializePayment(paystack_data);
      return successResponse(res, 200, "Transaction initalized successfully", paymentDetails);
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }

  /**
  * @param {object} req - The user request object
  * @param {object} res - The user response object
  * @returns {object} Success message
  */
  static async verify(req: Request, res: Response) {
    try {
      const { trxref } = req.query;
      if (!trxref) { return errorResponse(res, 404, "No transaction reference was found."); }

      const resp: any = await verifyPayment(trxref as string);
      console.log("q", resp.data.data);
      const { data } = resp.data;
      const { transactionId } = data.metadata;
      const transaction = await models.Credit.findOne({ where: { id: transactionId } });
      if (!transaction) {
        return errorResponse(res, 404, "Transaction not found, please contact support.");
      }
      if (transaction.status !== "pending") {
        return errorResponse(res, 409, "Transaction already settled");
      }
      await transaction.update({reference: data.reference}, { where: { id: transaction.id }});

      const { receiver } = transaction as any;
      if (transaction.amount !== data.amount / 100) {
        await (await models.Credit.findOne(transactionId))
          .update({ status: "conflict" });
        return errorResponse(res, 409, "Incorrect transaction amount.");
      }
      if (["success", "successful"].includes(data.status)) {
        const userCredit = await models.Credit.findOne(transactionId);
        await userCredit.update({ status: "successful" });
        await (await models.User.findOne(receiver.id))
          .increment({ balance: data.amount / 100 });
        const subject = "Payment successful";
        const message = "Account fully funded.";
        await sendEmail(receiver.email, subject, message);
        return successResponse(res, 200, "Payment was successful", userCredit);
      }
      return errorResponse(res, 400, "Transaction could not be verified, please try again.");
    } catch (error) {
      handleError(error, req);
      return errorResponse(res, 500, "Server error");
    }
  }
}
