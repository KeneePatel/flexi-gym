import React from "react";
import { StripeWrapper } from "@/components/payment/stripe-wrapper";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function CheckoutPage() {
  return (
    <div className="max-w-4xl mx-auto p-6 md:p-10">
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Gym Membership</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="grid gap-1">
                <Label>Gym ID</Label>
                <div className="text-muted-foreground">GYM-123456</div>
              </div>
              <div className="grid gap-1">
                <Label>Start Date</Label>
                <div className="text-muted-foreground">July 1, 2024</div>
              </div>
              <div className="grid gap-1">
                <Label>End Date</Label>
                <div className="text-muted-foreground">June 30, 2025</div>
              </div>
              <div className="grid gap-1">
                <Label>Total</Label>
                <div className="text-2xl font-bold">$99.99</div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div>
          <StripeWrapper />
        </div>
      </div>
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Purchase Summary</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center justify-between">
              <div>Gym Membership</div>
              <div className="font-medium">$99.99</div>
            </div>
            <Separator />
            <div className="flex items-center justify-between font-medium">
              <div>Total</div>
              <div>$99.99</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
