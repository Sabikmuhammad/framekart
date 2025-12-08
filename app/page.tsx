"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Star, Shield, Truck, Heart } from "lucide-react";
import { useEffect, useState } from "react";
import FrameCard from "@/components/FrameCard";

export default function HomePage() {
  const [frames, setFrames] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/frames")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFrames(data.data.slice(0, 6));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-secondary/10 py-12 sm:py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mx-auto max-w-3xl text-center"
          >
            <h1 className="mb-4 sm:mb-6 text-3xl sm:text-4xl font-bold tracking-tight md:text-6xl">
              Frame Your Memories,{" "}
              <span className="text-primary">Beautifully</span>
            </h1>
            <p className="mb-6 sm:mb-8 text-base sm:text-lg text-muted-foreground md:text-xl">
              Discover our curated collection of premium wall frames. Perfect for every space, every style.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/frames">
                <Button size="lg" className="gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Frames */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Featured Frames</h2>
            <p className="text-muted-foreground">
              Handpicked selections to elevate your space
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="h-96 animate-pulse bg-muted" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
              {frames.map((frame: any) => (
                <FrameCard key={frame._id} frame={frame} />
              ))}
            </div>
          )}

          <div className="mt-8 sm:mt-12 text-center">
            <Link href="/frames">
              <Button size="lg" variant="outline">
                View All Frames
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-muted/40 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Shop by Category</h2>
            <p className="text-muted-foreground">
              Find the perfect frame for any room
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {["Wall Frames", "Calligraphy Frames", "Birthday Frames", "Photo Frames", "Custom Frames"].map((category) => (
              <Link key={category} href={`/frames?category=${category}`}>
                <Card className="group cursor-pointer transition-all hover:shadow-lg">
                  <CardContent className="flex aspect-square items-center justify-center p-4 sm:p-6">
                    <h3 className="text-base sm:text-xl font-semibold group-hover:text-primary text-center">
                      {category}
                    </h3>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">Why Choose FrameKart?</h2>
            <p className="text-muted-foreground">
              Experience excellence in every detail
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Star,
                title: "Premium Quality",
                description: "Handcrafted frames with attention to detail",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Free shipping on orders over ₹2000",
              },
              {
                icon: Shield,
                title: "Secure Payment",
                description: "100% secure checkout with Razorpay",
              },
              {
                icon: Heart,
                title: "Customer Love",
                description: "Rated 4.9/5 by 1000+ happy customers",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="text-center">
                  <CardContent className="pt-4 sm:pt-6 px-3 sm:px-6">
                    <feature.icon className="mx-auto mb-3 sm:mb-4 h-10 w-10 sm:h-12 sm:w-12 text-primary" />
                    <h3 className="mb-2 font-semibold text-sm sm:text-base">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted/40 py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="mb-3 sm:mb-4 text-2xl sm:text-3xl font-bold">What Our Customers Say</h2>
            <p className="text-muted-foreground">
              Real reviews from real customers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[
              {
                name: "",
                review: "Absolutely love my frames! The quality is outstanding and delivery was super fast.",
                rating: 5,
              },
              {
                name: "",
                review: "Best online frame store in India. Great variety and excellent customer service.",
                rating: 5,
              },
              {
                name: "",
                review: "The frames transformed my living room. Highly recommend FrameKart!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card>
                  <CardContent className="pt-4 sm:pt-6 px-4 sm:px-6">
                    <div className="mb-4 flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star
                          key={i}
                          className="h-4 w-4 fill-yellow-400 text-yellow-400"
                        />
                      ))}
                    </div>
                    <p className="mb-4 text-sm">{testimonial.review}</p>
                    <p className="font-semibold">{testimonial.name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
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
    </div>
  );
}
