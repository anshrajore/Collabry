import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { Hero } from "@/components/landing/Hero";
import { Trust } from "@/components/landing/Trust";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Features } from "@/components/landing/Features";
import { CtaFooter } from "@/components/landing/CtaFooter";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Collabry — Turn Your Influence Into Income" },
      {
        name: "description",
        content:
          "Collabry connects creators with iconic brands. AI matching, real-time chat, secure payments — the luxury creator economy platform.",
      },
      { property: "og:title", content: "Collabry — Turn Your Influence Into Income" },
      {
        property: "og:description",
        content: "Connect with brands. Monetize your content. The modern creator economy.",
      },
    ],
  }),
});

function Index() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Trust />
        <HowItWorks />
        <Features />
        <CtaFooter />
      </main>
      <Footer />
    </div>
  );
}
