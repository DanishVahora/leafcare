import React, { useEffect, useState } from "react";
import { CheckCircle, ArrowRight, Award, ShieldCheck, Zap, Layers, Lock, CreditCard } from "lucide-react";
import { motion } from "framer-motion";
import Layout from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscribePro: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [paymentPeriod, setPaymentPeriod] = useState<"monthly" | "annual">("annual");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);

    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerItems = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const handlePayment = () => {
    setIsLoading(true);
    
    // This would typically come from your backend
    const paymentData = {
      key: "rzp_test_YOUR_KEY_HERE", // Replace with your actual test key
      amount: paymentPeriod === "monthly" ? 999 * 100 : 9990 * 100, // Amount in smallest currency unit (paise)
      currency: "INR",
      name: "Plant Disease Detection Pro",
      description: paymentPeriod === "monthly" ? "Monthly Subscription" : "Annual Subscription",
      image: "/logo.png",
      handler: function (response: any) {
        alert(`Payment successful! Payment ID: ${response.razorpay_payment_id}`);
        setIsLoading(false);
        // Here you would typically call your backend to verify the payment
        // and activate the subscription
      },
      prefill: {
        name: "",
        email: "",
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
      alert("Something went wrong. Please try again later.");
    }
  };

  const features = [
    {
      title: "Unlimited Scans",
      icon: <Zap className="w-6 h-6 text-green-500" />,
      description: "Scan unlimited plant images for disease detection with no daily restrictions"
    },
    {
      title: "Priority Processing",
      icon: <Layers className="w-6 h-6 text-green-500" />,
      description: "Get faster processing times with dedicated servers for Pro users"
    },
    {
      title: "Advanced Analytics",
      icon: <Award className="w-6 h-6 text-green-500" />,
      description: "Access detailed analysis reports with treatment recommendations"
    },
    {
      title: "Data Export",
      icon: <ArrowRight className="w-6 h-6 text-green-500" />,
      description: "Export your data in multiple formats (CSV, PDF, JSON)"
    },
    {
      title: "Bulk Processing",
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      description: "Upload and process multiple images at once"
    },
    {
      title: "API Access",
      icon: <Lock className="w-6 h-6 text-green-500" />,
      description: "Integrate our AI directly into your own applications"
    }
  ];

  const pricingOptions = {
    monthly: {
      price: "₹999",
      original: "₹1,299",
      savings: "",
      period: "/month"
    },
    annual: {
      price: "₹9,990",
      original: "₹11,988",
      savings: "Save ₹1,998 (17%)",
      period: "/year"
    }
  };

  return (
    <Layout>
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
        <div
          className="h-full bg-green-600 transition-all duration-200"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Animated Background Gradient */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 to-green-100 animate-[gradientShift_10s_infinite]" />
      </div>

      {/* HERO SECTION */}
      <section className="container mx-auto px-6 py-16">
        <motion.div
          className="flex flex-col items-center text-center max-w-4xl mx-auto"
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          transition={{ duration: 0.8 }}
        >
          <Badge variant="secondary" className="mb-4">Upgrade Today</Badge>
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Unlock the Full Power of
            <span className="block text-green-600 mt-2">
              Plant Disease Detection Pro
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get advanced features, unlimited scans, and priority processing to better protect your crops and maximize your yield.
          </p>
        </motion.div>
      </section>

      {/* PRICING SECTION */}
      <section className="py-16 px-6 bg-white">
        <motion.div
          className="max-w-5xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose the plan that works best for you with no hidden fees
            </p>
          </motion.div>

          <motion.div variants={fadeInUp} className="mb-12">
            <Tabs 
              defaultValue="annual" 
              className="w-80 mx-auto"
              onValueChange={(value) => setPaymentPeriod(value as "monthly" | "annual")}
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                <TabsTrigger value="annual">Annual</TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="p-8 shadow-2xl rounded-3xl border-t-4 border-green-500 max-w-3xl mx-auto overflow-hidden">
              <div className="absolute -right-8 -top-8 bg-green-100 rounded-full p-8 w-32 h-32 flex items-end justify-start">
                <Badge variant="outline" className="bg-green-500 text-white border-none text-xs px-2">
                  BEST VALUE
                </Badge>
              </div>
              
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro Membership</h3>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-4xl font-extrabold text-green-600">
                      {paymentPeriod === "monthly" ? pricingOptions.monthly.price : pricingOptions.annual.price}
                    </span>
                    <span className="text-gray-500 line-through text-lg">
                      {paymentPeriod === "monthly" ? pricingOptions.monthly.original : pricingOptions.annual.original}
                    </span>
                    <span className="text-gray-500 text-sm">
                      {paymentPeriod === "monthly" ? pricingOptions.monthly.period : pricingOptions.annual.period}
                    </span>
                  </div>
                  {paymentPeriod === "annual" && (
                    <p className="text-green-600 font-medium mb-4">
                      {pricingOptions.annual.savings}
                    </p>
                  )}
                  <Button 
                    className="group w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-lg font-semibold transition hover:bg-green-700 shadow-lg hover:shadow-green-200 mt-4"
                    onClick={handlePayment}
                    disabled={isLoading}
                  >
                    {isLoading ? "Processing..." : "Subscribe Now"}
                    {!isLoading && (
                      <CreditCard className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    )}
                  </Button>
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Secure payment powered by Razorpay
                  </p>
                </div>

                <div className="border-t md:border-l md:border-t-0 border-gray-200 pt-6 md:pt-0 md:pl-8 w-full">
                  <h4 className="font-medium text-gray-700 mb-4">All Features Include:</h4>
                  <ul className="space-y-3">
                    {features.slice(0, 4).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature.title}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section className="py-16 px-6 bg-gray-50">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Pro Features
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to take your plant disease detection to the next level
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div 
                key={index} 
                variants={fadeInUp} 
                custom={index}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-6 shadow-lg rounded-xl bg-white h-full flex flex-col">
                  <div className="rounded-full bg-green-100 p-3 w-12 h-12 flex items-center justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 flex-grow">{feature.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* COMPARISON TABLE */}
      <section className="py-16 px-6">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Pro vs Free
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              See how our Pro plan compares to the free version
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Card className="shadow-xl rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-green-50">
                      <th className="text-left p-4 border-b border-gray-200 text-gray-600">Features</th>
                      <th className="p-4 border-b border-gray-200 text-gray-600">Free</th>
                      <th className="p-4 border-b border-gray-200 text-green-600 font-bold">Pro</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Disease Detection</td>
                      <td className="p-4 border-b border-gray-200 text-center">Basic</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">Advanced</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Daily Scans</td>
                      <td className="p-4 border-b border-gray-200 text-center">5</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">Unlimited</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Analysis Reports</td>
                      <td className="p-4 border-b border-gray-200 text-center">Basic</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">Comprehensive</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Treatment Recommendations</td>
                      <td className="p-4 border-b border-gray-200 text-center">✓</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">✓ Premium</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Bulk Processing</td>
                      <td className="p-4 border-b border-gray-200 text-center">✗</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">✓</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Data Export</td>
                      <td className="p-4 border-b border-gray-200 text-center">✗</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">✓</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">API Access</td>
                      <td className="p-4 border-b border-gray-200 text-center">✗</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">✓</td>
                    </tr>
                    <tr>
                      <td className="p-4 border-b border-gray-200 text-gray-600">Priority Support</td>
                      <td className="p-4 border-b border-gray-200 text-center">✗</td>
                      <td className="p-4 border-b border-gray-200 text-center font-medium text-green-600">✓</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 px-6 bg-gray-50">
        <motion.div
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.div className="text-center mb-16" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Frequently Asked Questions
            </h2>
          </motion.div>

          <div className="space-y-6">
            {[
              {
                question: "How do I get started with Pro?",
                answer: "Simply select your preferred billing period, complete the payment process through our secure Razorpay integration, and your account will be instantly upgraded to Pro status."
              },
              {
                question: "Can I cancel my subscription?",
                answer: "Yes, you can cancel your subscription at any time from your account settings. You'll continue to have Pro access until the end of your current billing period."
              },
              {
                question: "Do you offer refunds?",
                answer: "We offer a 7-day money-back guarantee if you're not satisfied with your Pro subscription for any reason."
              },
              {
                question: "Is my payment information secure?",
                answer: "Yes, we use Razorpay, a trusted payment processor that meets the highest security standards. We never store your credit card information on our servers."
              },
              {
                question: "Can I switch between monthly and annual billing?",
                answer: "Yes, you can switch at the end of your current billing period. If you switch from monthly to annual, you'll start enjoying the discounted annual rate immediately."
              }
            ].map((item, index) => (
              <motion.div key={index} variants={fadeInUp} custom={index}>
                <Card className="p-6 shadow-md rounded-xl bg-white">
                  <h3 className="text-xl font-semibold text-green-700 mb-2">{item.question}</h3>
                  <p className="text-gray-600">{item.answer}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 px-6">
        <motion.div
          className="max-w-4xl mx-auto bg-green-600 rounded-3xl p-12 text-center text-white shadow-2xl"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Take Your Plant Disease Detection to the Next Level?
          </h2>
          <p className="text-lg text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers and agricultural professionals who trust our Pro solution to protect their crops.
          </p>
          <Button 
            variant="secondary" 
            size="lg" 
            className="group px-8 py-4 rounded-xl text-lg font-semibold text-green-600 hover:text-green-700 shadow-lg hover:shadow-green-700/20"
            onClick={handlePayment}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Get Started Today"}
            {!isLoading && (
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            )}
          </Button>
        </motion.div>
      </section>
    </Layout>
  );
};

export default SubscribePro;