"use client";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import ProtectedRoute from '../../../Auth/ProtectedRoutes';
import { AuthContext } from '../../../Auth/AuthContext';
import {useContext, useEffect, useState} from "react";
import {getProfileData} from "../../../Auth/AuthService";
import {getGymInitials, getInitialsFromUser} from "@/lib/utils";

interface DecodedToken {
  firstName?: string;
  lastName?: string;
  gymName?: string;
  type?: string;
  email?: string;
}


export default function ProfilePage() {
  const context = useContext(AuthContext);
  const [profileData, setProfileData] = useState<DecodedToken | null>(null);
  const userProfile = getProfileData();

  useEffect(() => {

    if (userProfile) {
      try {
        // @ts-ignore
        console.log(userProfile);
        setProfileData(userProfile);
      } catch (error) {
        console.error('Token decoding failed:', error);
      }
    }
  }, []);

  const displayFallback = profileData?.type === 'gym'
      ? getGymInitials(profileData.gymName || 'Gym')
      : getInitialsFromUser({
        firstName: profileData?.firstName || '',
        lastName: profileData?.lastName || ''
      });
  // @ts-ignore
  return (
      <ProtectedRoute>
        <div className="w-full max-w-3xl mx-auto">
          <header className="bg-primary p-6 rounded-t-lg">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder-user.jpg"/>
                <AvatarFallback>{displayFallback}</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <h1 className="text-2xl font-bold text-primary-foreground">John Doe</h1>
                <p className="text-sm text-primary-foreground/80"></p>
              </div>
            </div>
          </header>
          <div className="bg-background p-6 rounded-b-lg space-y-6">
            <section>
              <h2 className="text-lg font-semibold">Contact Information</h2>
              <div className="grid gap-4 mt-2">
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" readOnly={true} value={profileData?.email}/>
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
