import { Request, Response } from "express";
import { StripeService } from "../services/StripeService";
import {
  BookingRepository,
  CreateBookingRequest,
} from "../repositories/BookingRepository";

export class PaymentController {
  constructor(
    private stripeService: StripeService,
    private bookingRepository: BookingRepository,
  ) {}

  createPaymentIntent = async (req: Request, res: Response): Promise<void> => {
    console.log("Received request to create payment intent");

    try {
      const { charges } = req.body;

      const clientSecret = await this.stripeService.createPaymentIntent(
        charges * 100,
      );

      res.json({ clientSecret });
    } catch (error) {
      console.log(`error creating a payment intent: ${error}`);
      res.status(500).json({ error: "Failed to create payment intent" });
    }
  };

  createBooking = async (req: Request, res: Response): Promise<void> => {
    console.log("Received request to create booking");

    try {
      const bookingRequest: CreateBookingRequest = req.body;
      const success: Boolean =
        await this.bookingRepository.createBooking(bookingRequest);
      if (!success) {
        console.log("failed to create a booking");
        return;
      }
      console.log("created a booking");
    } catch (error) {
      console.log(`error creating the booking: ${error}`);
      res.status(500).json({ error: "Failed to create the booking" });
    }
  };
}
