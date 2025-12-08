import { Card, CardContent } from "@/components/ui/card";
import { Heart, Award, Users, TrendingUp } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold">About FrameKart</h1>
          <p className="text-lg text-muted-foreground">
            Your trusted partner in framing memories since 2020
          </p>
        </div>

        <div className="prose prose-lg mx-auto mb-12">
          <p>
            FrameKart began with a simple mission: to make premium quality wall frames accessible to everyone. We believe that every memory, every piece of art, and every moment deserves to be beautifully framed and displayed.
          </p>
          <p>
            Our team of craftsmen and designers work tirelessly to bring you frames that combine traditional craftsmanship with modern aesthetics. Each frame in our collection is carefully selected to ensure it meets our high standards of quality and design.
          </p>
          <p>
            Today, we&apos;re proud to serve thousands of customers across India, helping them transform their spaces with our carefully curated collection of wall frames.
          </p>
        </div>

        <div className="mb-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: Heart,
              title: "5000+",
              description: "Happy Customers",
            },
            {
              icon: Award,
              title: "Premium",
              description: "Quality Guaranteed",
            },
            {
              icon: Users,
              title: "Expert",
              description: "Craftsmen Team",
            },
            {
              icon: TrendingUp,
              title: "Fast",
              description: "Growing Business",
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="pt-6 text-center">
                <stat.icon className="mx-auto mb-3 h-10 w-10 text-primary" />
                <p className="mb-1 text-2xl font-bold">{stat.title}</p>
                <p className="text-sm text-muted-foreground">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-8">
            <h2 className="mb-4 text-2xl font-bold">Our Values</h2>
            <div className="space-y-4">
              <div>
                <h3 className="mb-2 font-semibold">Quality First</h3>
                <p className="text-muted-foreground">
                  We never compromise on the quality of our materials or craftsmanship.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Customer Satisfaction</h3>
                <p className="text-muted-foreground">
                  Your happiness is our success. We go the extra mile to ensure you love your frames.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Innovation</h3>
                <p className="text-muted-foreground">
                  We constantly explore new designs and techniques to bring you the latest trends.
                </p>
              </div>
              <div>
                <h3 className="mb-2 font-semibold">Sustainability</h3>
                <p className="text-muted-foreground">
                  We&apos;re committed to eco-friendly practices and sustainable sourcing.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
