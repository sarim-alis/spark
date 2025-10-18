import React from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const faqs = [
  {
    question: "Do I need technical skills to use Course Spark?",
    answer: "Not at all! Course Spark is designed to be completely code-free. If you can write an email, you can create a beautiful, professional online course with our platform."
  },
  {
    question: "How does the AI course generation work?",
    answer: "You simply provide a topic, target audience, and desired length for your course. Our AI then analyzes this information to generate a complete curriculum, including lesson titles, detailed content for each lesson, and even a unique thumbnail image."
  },
  {
    question: "How is Course Spark different from other platforms like Teachable or Thinkific?",
    answer: "Our key differentiator is the powerful AI integration that dramatically speeds up the course creation process. We also focus on providing a clean, modern, and intuitive user experience, and we don't take a cut of your sales on our Pro plan."
  },
  {
    question: "Can I use my own domain name?",
    answer: "Yes, on our Pro plan, you can connect your own custom domain to your Course Spark storefront for a fully branded experience."
  },
  {
    question: "What kind of support is available?",
    answer: "We offer email support on all plans. Pro plan subscribers receive priority support, ensuring you get faster response times for any questions or issues you encounter."
  }
];

export default function FAQSection() {
  return (
    <section id="faq" className="py-20 sm:py-24 bg-slate-50/70">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            Have questions? We've got answers. If you don't see your question here, feel free to reach out.
          </p>
        </div>
        <div className="mt-12">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-slate-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}