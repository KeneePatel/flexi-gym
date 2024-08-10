import Stripe from "stripe";

export class StripeService {
  private stripe: Stripe;

  constructor(apiKey: string) {
    this.stripe = new Stripe(apiKey, { apiVersion: "2024-06-20" });
  }

  async createPaymentIntent(amount: number): Promise<string> {
    const paymentIntent = await this.stripe.paymentIntents.create({
      amount,
      currency: "usd",
    });
    return paymentIntent.client_secret!;
  }
}
