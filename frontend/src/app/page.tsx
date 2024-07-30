import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  DumbbellIcon,
  MegaphoneIcon,
  WalletIcon,
} from "lucide-react";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen items-center justify-between p-4 bg-accent">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container grid gap-12 px-4 md:px-6 lg:grid-cols-2 lg:gap-24">
          <div className="space-y-6">
            <div className="space-y-3">
              <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
                Flexible Gym Access, No Fixed Memberships
              </h1>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Book your gym sessions for as little as 2 days. Discover the
                flexibility of FlexiGym, where you can access top-notch
                facilities without long-term commitments.
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link href="#">
                <Button>Book Now</Button>
              </Link>
              <Link href="#">
                <Button variant="outline">Become a Partner</Button>
              </Link>
              <Link href="gyms">
                <Button variant="outline">Explore Gyms</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-6">
            <Image
              src="/gym-member-workingout-portrait.avif"
              width="600"
              height="400"
              alt="Hero"
              className="mx-auto rounded-xl object-cover"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="bg-muted p-4 md:p-4">
                <CardContent className="flex flex-col items-start gap-1 md:gap-2 justify-center">
                  <CalendarIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold">Book Anytime</h3>
                  <p className="text-muted-foreground">
                    Access top-notch gyms for as little as 2 days.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted p-4">
                <CardContent className="flex flex-col items-start gap-2">
                  <MegaphoneIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold">Promote Events</h3>
                  <p className="text-muted-foreground">
                    Gym owners can post promotions and events.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted p-4">
                <CardContent className="flex flex-col items-start gap-2">
                  <DumbbellIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold">Variety of Gyms</h3>
                  <p className="text-muted-foreground">
                    Choose from a wide range of fitness centers and studios.
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-muted p-4">
                <CardContent className="flex flex-col items-start gap-2">
                  <WalletIcon className="h-8 w-8 text-primary" />
                  <h3 className="text-lg font-semibold">Pay-as-you-go</h3>
                  <p className="text-muted-foreground">
                    No long-term commitments, pay only for the sessions you use.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
