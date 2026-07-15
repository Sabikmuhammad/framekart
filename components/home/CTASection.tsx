"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function CTASection() {
  return (
    <section className="py-12 sm:py-16">
      <div className="container mx-auto px-4">
        <Card className="bg-gradient-to-r from-primary to-primary/80 text-white">
          <CardContent className="py-8 sm:py-12 px-4 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">
              Ready to Transform Your Space?
            </h2>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg opacity-90">
              Explore our collection and find the perfect frame today
            </p>
            <Link href="/frames">
              <Button size="lg" variant="secondary">
                Start Shopping
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
