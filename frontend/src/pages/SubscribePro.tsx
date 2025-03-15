import React, { useState, useEffect } from "react";
import { motion,  useScroll, useTransform } from "framer-motion";
import { CheckCircle, ArrowRight, ShieldCheck, Gift, Clock, Loader2, Leaf, Sparkles } from "lucide-react";
import { BarChart3, FileText, History, Headset, Code, Scan } from "lucide-react";
import Layout from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { useSubscription } from "@/hooks/useSubscription";
import { loadRazorpayScript } from "@/lib/razorpay";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { PaymentVerificationData } from "@/types/subscription";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const width = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <motion.div
      className="fixed top-0 left-0 h-1 bg-green-500 z-50"
      style={{ width }}
    />
  );
};

const SubscribePro: React.FC = () => {
  const [paymentPeriod, setPaymentPeriod] = useState<"monthly" | "annual">("annual");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  // Add subscription hook and auth context
  const { createOrder, verifyPayment } = useSubscription();
  const { user, refreshUserData } = useAuth(); // Changed from refreshUser to refreshUserData
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handlePayment = async () => {
    if (!email) {
      toast.error("Please enter your email to continue");
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      // 1. Load Razorpay SDK
      await loadRazorpayScript();

      if (!window.Razorpay) {
        throw new Error("Razorpay SDK not available");
      }

      // 2. Create order on backend
      const plan = paymentPeriod;
      const orderData = await createOrder(plan, discountApplied ? couponCode : undefined);
      
      console.log("Order created:", orderData);
      
      // 3. Setup Razorpay payment options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: orderData.amount * 100, // Amount in paise
        currency: orderData.currency,
        name: "LeafCare Pro",
        description: `${paymentPeriod === "monthly" ? "Monthly" : "Annual"} Subscription`,
        order_id: orderData.orderId,
        handler: async function(response: any) {
          console.log("Payment successful:", response);
          
          try {
            // 4. Verify payment with backend
            const verificationData: PaymentVerificationData = {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              plan,
              couponCode: discountApplied ? couponCode : undefined
            };
            
            // Send verification data to backend
            const result = await verifyPayment(verificationData);
            console.log("Payment verified:", result);
            
            // 5. Update user status and show success
            await refreshUserData(); // Changed from refreshUser to refreshUserData
            
            toast("Success!", {
              description: "Your subscription has been activated successfully",
            });
            
            // Redirect to dashboard or subscription success page
            navigate("/dashboard");
          } catch (verifyError) {
            console.error("Verification failed:", verifyError);
            setPaymentError("Payment was processed but verification failed. Please contact support.");
            toast.error("Your payment was processed but we couldn't verify it. Please contact support.");
          }
        },
        prefill: {
          name: user?.firstName || "",
          email: email,
          contact: user?.email || ""
        },
        theme: {
          color: "#22c55e"
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
            console.log("Payment dismissed");
          }
        }
      };
      
      // 6. Open Razorpay checkout
      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } catch (error) {
      console.error("Payment initialization error:", error);
      setPaymentError("Payment initialization failed. Please try again.");
      toast.error("There was an error starting the payment process. Please try again.");
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === "PLANT15" || couponCode.toUpperCase() === "NEWYEAR") {
      setDiscountApplied(true);
    }
  };

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
  const benefitIcons = [
    <Scan className="w-6 h-6 text-green-600" />,
    <BarChart3 className="w-6 h-6 text-green-600" />,
    <FileText className="w-6 h-6 text-green-600" />,
    <History className="w-6 h-6 text-green-600" />,
    <Headset className="w-6 h-6 text-green-600" />,
    <Code className="w-6 h-6 text-green-600" />,
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

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  // const slideUp = {
  //   hidden: { height: 0, opacity: 0 },
  //   visible: { height: "auto", opacity: 1 },
  //   exit: { height: 0, opacity: 0 }
  // };

  return (
    <Layout>
      <ScrollProgress />

      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-green-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 animate-[gradientShift_10s_infinite]" />
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-200 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* HERO SECTION */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
        transition={{ duration: 0.6 }}
        className="container mx-auto px-6 py-16 relative overflow-hidden"
      >
        <div className="absolute right-0 top-0 opacity-10 -translate-y-1/3">
          <Leaf className="w-[800px] h-[800px] text-green-200" />
        </div>

        <div className="flex flex-col items-center text-center max-w-4xl mx-auto relative">
          <motion.div variants={fadeInUp}>
            <Badge variant="outline" className="bg-green-100 text-green-800 mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              Premium Features
            </Badge>
          </motion.div>

          <motion.h1 variants={fadeInUp} className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Elevate Your Plant Care with
            <span className="block text-green-600 mt-2 bg-clip-text  bg-gradient-to-r from-green-600 to-emerald-600">
              LeafCare Pro
            </span>
          </motion.h1>

          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get advanced features, unlimited scans, and premium support to better protect your crops and maximize your yield.
          </p>

          <Button
            className="bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-md transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            onClick={() => {
              document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
            }}
          >
            View Plans
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
      </motion.section>

      {/* BENEFITS SECTION */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={staggerItems}
        className="py-16 px-6 bg-white"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeInUp} className="text-center mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Pro Features for Better Plant Health
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Our professional tools help you monitor and maintain optimal plant health
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                variants={fadeInUp}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 shadow-lg rounded-xl bg-white h-full flex flex-col hover:shadow-xl transition-all">
                  <div className="bg-green-100 w-fit p-3 rounded-lg mb-4 transition-colors group-hover:bg-green-200">
                    {benefitIcons[index]}
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 flex-grow">{benefit.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>

        </div>
      </motion.section>

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
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Loading Razorpay...
                    </div>
                  ) : (
                    "Subscribe Now"
                  )}
                </Button>

                {paymentError && (
                  <p className="text-red-500 text-sm mt-2">{paymentError}</p>
                )}
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