import { redirect } from "next/navigation";
import { CheckoutClient } from "./checkout-client";
import { Container } from "@/components/ui/container";
import { Section } from "@/components/ui/section";

export default async function CheckoutPage() {
  return (
    <>
      <Section className="pt-32 pb-16">
        <Container size="narrow">
          <CheckoutClient />
        </Container>
      </Section>
    </>
  );
}

