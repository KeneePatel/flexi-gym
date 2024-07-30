export class PaymentService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
  }

  async createPaymentIntent(bookingId: string): Promise<string> {
    const apiUri = `${this.apiUrl}/api/create-payment-intent`;
    const response = await fetch(apiUri, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bookingId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create payment intent");
    }

    const { clientSecret } = await response.json();
    return clientSecret;
  }
}
