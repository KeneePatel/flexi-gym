import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQ_CONTENT } from "@/lib/constants";

export default function FAQPage() {
  return (
    <div className="w-full max-w-3xl mx-auto py-12 md:py-20">
      <div className="space-y-8">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            FlexiGym FAQ
          </h1>
          <p className="mt-4 text-muted-foreground">
            Get answers to your questions about the FlexiGym platform.
          </p>
        </div>
        <div className="space-y-4">
          <Accordion type="single" collapsible className="w-full px-4 md:px-2">
            {FAQ_CONTENT.map((faq, index) => {
              return (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-justify">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
