import { Request, Response } from "express";
import { StripeService } from "../services/StripeService";
import { BookingRepository } from "../repositories/BookingRepository";

export class PaymentController {
  constructor(
    private stripeService: StripeService,
    private bookingRepository: BookingRepository,
  ) {}

  createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    console.log("Received request to create payment intent");

    try {
      const { bookingId } = req.body;
      const booking = await this.bookingRepository.getBookingById(bookingId);

      if (!booking) {
        res.status(404).json({ error: "Booking not found" });
        return;
      }

      const clientSecret = await this.stripeService.createPaymentIntent(
        booking.totalAmount,
        { bookingId: booking.id, userId: booking.userId, gymId: booking.gymId },
      );

      res.json({ clientSecret });
    } catch (error) {
      console.log(`error creating a payment intent: ${error}`);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  };
}
