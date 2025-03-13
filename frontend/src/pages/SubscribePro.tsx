import React, { useState } from "react";
import { CheckCircle, ArrowRight, ShieldCheck, Gift, Clock } from "lucide-react";
import Layout from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscribePro: React.FC = () => {
  const [paymentPeriod, setPaymentPeriod] = useState<"monthly" | "annual">("annual");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  
  const handlePayment = () => {
    if (!email) {
      return;
    }
    
    setIsLoading(true);
    
    let amount = paymentPeriod === "monthly" ? 999 : 9990;
    
    // Apply discount if coupon is valid
    if (discountApplied) {
      amount = Math.floor(amount * 0.85); // 15% discount
    }
    
    // This would typically come from your backend
    const paymentData = {
      key: import.meta.env.VITE_RAZORPAY_API_KEY,
      amount: amount * 100, // Amount in smallest currency unit (paise)
      currency: "INR",
      name: "LeafCare Pro",
      description: paymentPeriod === "monthly" ? "Monthly Subscription" : "Annual Subscription",
      image: "/logo.png",
      handler: function (response: unknown) {
        setIsLoading(false);
        console.log("Payment success:", response);
        // Here you would typically call your backend to verify the payment
        // and activate the subscription
      },
      prefill: {
        name: "",
        email: email,
        contact: ""
      },
      theme: {
        color: "#22c55e"
      },
      modal: {
        ondismiss: function() {
          setIsLoading(false);
        }
      }
    };

    try {
      const razorpay = new window.Razorpay(paymentData);
      razorpay.open();
    } catch (error) {
      console.error("Razorpay error:", error);
      setIsLoading(false);
    }
  };
  
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PLANT15" || couponCode.toUpperCase() === "NEWYEAR") {
      setDiscountApplied(true);
    }
  };

  // Core benefits as specified
  const benefits = [
    {
      title: "Unlimited Scans",
      description: "Scan unlimited plant images for disease detection with no daily restrictions"
    },
    {
      title: "Advanced Analytics",
      description: "Access detailed analysis reports with treatment recommendations"
    },
    {
      title: "Data Export",
      description: "Export your data in multiple formats (CSV, PDF, JSON)"
    },
    {
      title: "Historical Data",
      description: "Access historical scans and track progress over time"
    },
    {
      title: "Premium Support",
      description: "Get prioritized support from our plant health experts"
    },
    {
      title: "API Access",
      description: "Integrate our AI directly into your own applications"
    }
  ];

  const planDetails = {
    monthly: {
      price: "₹999",
      original: "₹1,299",
      period: "/month"
    },
    annual: {
      price: "₹9,990",
      original: "₹15,588",
      savings: "Save ₹5,598 (36%)",
      period: "/year"
    }
  };

  const faqs = [
    {
      question: "What are the differences between monthly and annual plans?",
      answer: "Both plans offer the same features. The annual plan provides a 36% discount compared to paying monthly."
    },
    {
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel your subscription at any time from your account dashboard. If you cancel within the first 7 days, we offer a full refund."
    },
    {
      question: "How accurate is the plant disease detection?",
      answer: "Our AI model has been trained on millions of plant images and can identify over 50 common plant diseases with an accuracy rate of 95%+."
    },
    {
      question: "Is my data secure?",
      answer: "Yes, we take data security very seriously. All your plant images and scan results are stored securely and encrypted. We do not share your data with third parties."
    }
  ];

  return (
    <Layout>
      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-16 bg-gradient-to-b from-green-50 to-white">
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          <Badge variant="outline" className="bg-green-100 text-green-800 mb-6">Premium Features</Badge>
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Elevate Your Plant Care with
            <span className="block text-green-600 mt-2">
              "LeafCare Pro"
            </span>
          </h1>
          
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get advanced features, unlimited scans, and premium support to better protect your crops and maximize your yield.
          </p>
          
          <Button 
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2"
            onClick={() => {
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Plans
            <ArrowRight className="w-5 h-5" />
          </Button>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            {["Premium Support", "Money-back Guarantee", "Secure Payment"].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Pro Features for Better Plant Health
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our professional tools help you monitor and maintain optimal plant health
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <Card key={index} className="p-6 shadow-md rounded-xl bg-white h-full flex flex-col hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-green-700 mb-2">{benefit.title}</h3>
                <p className="text-gray-600 flex-grow">{benefit.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing-section" className="py-16 px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="mb-12">
            <Tabs 
              defaultValue="annual" 
              className="w-80 mx-auto"
              onValueChange={(value) => setPaymentPeriod(value as "monthly" | "annual")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">Save 36%</span></TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Card className="p-8 shadow-xl rounded-xl border-t-4 border-green-500 overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Plant Disease Detection Pro</h3>
                <p className="text-gray-500 mt-1">All features included</p>
                
                <div className="flex items-baseline gap-2 mt-4">
                  <span className="text-4xl font-extrabold text-green-600">
                    {paymentPeriod === "monthly" ? planDetails.monthly.price : planDetails.annual.price}
                  </span>
                  <span className="text-gray-500 line-through text-base">
                    {paymentPeriod === "monthly" ? planDetails.monthly.original : planDetails.annual.original}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {paymentPeriod === "monthly" ? planDetails.monthly.period : planDetails.annual.period}
                  </span>
                </div>
                
                {paymentPeriod === "annual" && (
                  <p className="text-green-600 font-medium mt-2">
                    {planDetails.annual.savings}
                  </p>
                )}
              </div>
              
              <div>
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="mb-3"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                
                <Button 
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Subscribe Now"}
                </Button>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <h4 className="font-medium text-gray-700 mb-4">All plans include:</h4>
              <div className="grid md:grid-cols-2 gap-x-8 gap-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600">{benefit.title}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Input 
                  placeholder="Coupon code" 
                  className="w-40"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={discountApplied}
                />
                <Button 
                  variant="outline" 
                  onClick={handleApplyCoupon}
                  disabled={!couponCode || discountApplied}
                >
                  Apply
                </Button>
                {discountApplied && (
                  <span className="text-green-600 text-sm">15% off applied!</span>
                )}
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Secure payment</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gift className="w-4 h-4" />
                  <span>7-day refund</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-12 px-6 bg-green-600 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Plant Health Management?
          </h2>
          <p className="text-xl mb-6 text-green-100 max-w-2xl mx-auto">
            Join thousands of growers who have already improved their yields with our AI-powered solution.
          </p>
          
          <Button
            className="bg-white text-green-700 hover:bg-green-50 px-8 py-3 text-lg font-semibold"
            onClick={() => {
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            Get Started Today
          </Button>
          
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-5 h-5" />
              <span>7-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              <span>Premium Support</span>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default SubscribePro;