"use client";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { DUMMY_USER } from "@/lib/dummy-data";
import ProfileAvatar from "@/components/profile-dropdown/profile-avatar";
import { getNameFromUser } from "@/lib/utils";
import ProtectedRoute from '@/Auth/ProtectedRoutes';

export default function ProfilePage() {
  return (
      <ProtectedRoute>
        <div className="w-full max-w-4xl mx-auto p-6 md:p-10">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 md:gap-10">
            <ProfileAvatar size={36} />
            <div className="flex-1 grid gap-2">
              <div className="grid gap-0">
                <div className="flex items-center justify-between gap-2">
                  <h1 className="text-2xl font-bold">
                    {getNameFromUser(DUMMY_USER)}
                  </h1>
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                </div>
                <div className="text-muted-foreground">
                  {"@" + DUMMY_USER.userName}
                </div>
              </div>
              <div className="text-sm leading-relaxed">{DUMMY_USER.bio}</div>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="grid gap-6">
            <div>
              <h2 className="text-xl font-bold">Your Gym Memberships</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>1 Month Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Start Date</div>
                      <div>June 1, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>End Date</div>
                      <div>July 1, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div>$49.99</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Renew
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>3 Month Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Start Date</div>
                      <div>April 15, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>End Date</div>
                      <div>July 15, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div>$129.99</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Renew
                    </Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>1 Week Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Start Date</div>
                      <div>July 1, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>End Date</div>
                      <div>July 8, 2023</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div>$19.99</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" size="sm">
                      Renew
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
            <div>
              <h2 className="text-xl font-bold">Purchase a New Membership</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle>1 Week Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div>$19.99</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Purchase</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>1 Month Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div>$49.99</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Purchase</Button>
                  </CardFooter>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>3 Month Membership</CardTitle>
                  </CardHeader>
                  <CardContent className="grid gap-2">
                    <div className="flex items-center justify-between">
                      <div>Price</div>
                      <div>$129.99</div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full">Purchase</Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
  );
}
