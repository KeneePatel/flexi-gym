"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ProtectedRoute from '@/Auth/ProtectedRoutes';

export default function ProfilePage() {
  return (
      <ProtectedRoute>
        <div className="w-full max-w-3xl mx-auto">
          <header className="bg-primary p-6 rounded-t-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg"/>
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h1 className="text-2xl font-bold text-primary-foreground">John Doe</h1>
                <p className="text-sm text-primary-foreground/80">Software Engineer</p>
              </div>
            </div>
          </header>
          <div className="bg-background p-6 rounded-b-lg space-y-6">
            <section>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <div className="grid gap-4 mt-2">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john@example.com"/>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 555-5555"/>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" defaultValue="San Francisco, CA"/>
                </div>
              </div>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Personal Details</h2>
              <div className="grid gap-4 mt-2">
                <div className="grid gap-1">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" defaultValue="John Doe"/>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" defaultValue="johndoe"/>
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="website">Website</Label>
                  <Input id="website" defaultValue="johndoe.com"/>
                </div>
              </div>
            </section>
            <Separator/>
            <div className="flex justify-end">
              <Button className="ml-auto">Save Changes</Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
  );
}
