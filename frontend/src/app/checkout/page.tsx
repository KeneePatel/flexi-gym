"use client";

import React from "react";
import { StripeWrapper } from "@/components/payment/stripe-wrapper";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import ProtectedRoute from "../../../Auth/ProtectedRoutes";
import { useSearchParams } from "next/navigation";

export default function CheckoutPage() {
  const searchParams = useSearchParams();

  const gymId = searchParams.get("gymId");
  const startDate = searchParams.get("startDate") || "";
  const endDate = searchParams.get("endDate") || "";
  const charges = searchParams.get("charges") || 0;

  return (
    <ProtectedRoute>
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
                  <div className="text-muted-foreground">{gymId}</div>
                </div>
                <div className="grid gap-1">
                  <Label>Start Date</Label>
                  <div className="text-muted-foreground">
                    {new Date(startDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label>End Date</Label>
                  <div className="text-muted-foreground">
                    {new Date(endDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="grid gap-1">
                  <Label>Total</Label>
                  <div className="text-2xl font-bold">{`$${charges}`}</div>
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
                <div className="font-medium">{`$${charges}`}</div>
              </div>
              <Separator />
              <div className="flex items-center justify-between font-medium">
                <div>Total</div>
                <div>{`$${charges}`}</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
