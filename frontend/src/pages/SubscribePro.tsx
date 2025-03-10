import React, { useEffect, useState, useRef } from "react";
import { CheckCircle, ArrowRight, Award, ShieldCheck, Zap, Layers, Lock, CreditCard, Users, Clock, Gift, BarChart, Server, Download, Sparkles } from "lucide-react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import Layout from "../Layout/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";

declare global {
  interface Window {
    Razorpay: any;
  }
}

const SubscribePro: React.FC = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [paymentPeriod, setPaymentPeriod] = useState<"monthly" | "annual">("annual");
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [discountApplied, setDiscountApplied] = useState(false);
  const [countdown, setCountdown] = useState({ hours: 23, minutes: 59, seconds: 59 });
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "pro" | "enterprise">("pro");
  
  const testimonialsRef = useRef(null);
  const isTestimonialsInView = useInView(testimonialsRef, { once: true, amount: 0.2 });
  
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setScrollProgress((totalScroll / windowHeight) * 100);
    };
    window.addEventListener("scroll", handleScroll);
    
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        }
        return prev;
      });
    }, 1000);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.body.removeChild(script);
      clearInterval(timer);
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
  
  const pulseAnimation = {
    hidden: { scale: 1 },
    visible: { 
      scale: [1, 1.05, 1],
      transition: { 
        repeat: Infinity,
        repeatType: "reverse" as const,
        duration: 2
      }
    }
  };

  const handlePayment = () => {
    if (!email) {
      return;
    }
    
    setIsLoading(true);
    
    let amount;
    if (selectedPlan === "basic") {
      amount = paymentPeriod === "monthly" ? 499 : 4990;
    } else if (selectedPlan === "pro") {
      amount = paymentPeriod === "monthly" ? 999 : 9990;
    } else {
      amount = paymentPeriod === "monthly" ? 1999 : 19990;
    }
    
    // Apply discount if coupon is valid
    if (discountApplied) {
      amount = Math.floor(amount * 0.85); // 15% discount
    }
    
    // This would typically come from your backend
    const paymentData = {
      key: "rzp_test_Lj9ueukNDVBw5I", // Replace with your actual test key
      amount: amount * 100, // Amount in smallest currency unit (paise)
      currency: "INR",
      name: "Plant Disease Detection " + selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1),
      description: paymentPeriod === "monthly" ? "Monthly Subscription" : "Annual Subscription",
      image: "/logo.png",
      handler: function (response: any) {
        setIsLoading(false);
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

  const features = [
    {
      title: "Unlimited Scans",
      icon: <Zap className="w-6 h-6 text-green-500" />,
      description: "Scan unlimited plant images for disease detection with no daily restrictions"
    },
    {
      title: "Priority Processing",
      icon: <Server className="w-6 h-6 text-green-500" />,
      description: "Get faster processing times with dedicated servers for Pro users"
    },
    {
      title: "Advanced Analytics",
      icon: <BarChart className="w-6 h-6 text-green-500" />,
      description: "Access detailed analysis reports with treatment recommendations"
    },
    {
      title: "Data Export",
      icon: <Download className="w-6 h-6 text-green-500" />,
      description: "Export your data in multiple formats (CSV, PDF, JSON)"
    },
    {
      title: "Bulk Processing",
      icon: <Layers className="w-6 h-6 text-green-500" />,
      description: "Upload and process multiple images at once"
    },
    {
      title: "API Access",
      icon: <Lock className="w-6 h-6 text-green-500" />,
      description: "Integrate our AI directly into your own applications"
    },
    {
      title: "Team Collaboration",
      icon: <Users className="w-6 h-6 text-green-500" />,
      description: "Add team members and collaborate on plant health monitoring"
    },
    {
      title: "Historical Data",
      icon: <Clock className="w-6 h-6 text-green-500" />,
      description: "Access historical scans and track progress over time"
    },
    {
      title: "Premium Support",
      icon: <ShieldCheck className="w-6 h-6 text-green-500" />,
      description: "Get prioritized support from our plant health experts"
    }
  ];
  
  const testimonials = [
    {
      name: "Rahul Sharma",
      role: "Organic Farm Owner",
      image: "/api/placeholder/48/48",
      content: "The Pro version has completely transformed how we monitor plant health. We've reduced pesticide use by 40% thanks to early detection."
    },
    {
      name: "Priya Patel",
      role: "Agricultural Consultant",
      image: "/api/placeholder/48/48",
      content: "I recommend Plant Disease Detection Pro to all my clients. The detailed analytics and treatment suggestions are invaluable."
    },
    {
      name: "Satish Kumar",
      role: "Commercial Grower",
      image: "/api/placeholder/48/48",
      content: "The API access lets us integrate disease detection directly into our farm management system. Well worth the investment."
    }
  ];

  const planDetails = {
    basic: {
      monthly: {
        price: "₹499",
        original: "₹699",
        savings: "",
        period: "/month"
      },
      annual: {
        price: "₹4,990",
        original: "₹6,988",
        savings: "Save ₹1,998 (29%)",
        period: "/year"
      },
      features: ["Basic disease detection", "5 scans per day", "Basic reports", "Email support"]
    },
    pro: {
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
      },
      features: ["Advanced disease detection", "Unlimited scans", "Comprehensive reports", "Treatment recommendations", "Data export", "Bulk processing", "Priority support"]
    },
    enterprise: {
      monthly: {
        price: "₹1,999",
        original: "₹2,499",
        savings: "",
        period: "/month"
      },
      annual: {
        price: "₹19,990",
        original: "₹24,988",
        savings: "Save ₹4,998 (20%)",
        period: "/year"
      },
      features: ["Everything in Pro", "API access", "Team collaboration", "Custom integrations", "Dedicated account manager", "White-labeled reports", "24/7 priority support"]
    }
  };

  return (
    <Layout>
      <br /><br />
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
        <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 bg-green-200 rounded-full filter blur-3xl opacity-20 animate-pulse" />
      </div>

      {/* Limited Time Offer Banner */}
      <div className="bg-green-600 text-white py-3 px-6 text-center sticky top-0 z-40">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-center gap-4">
          <Sparkles className="w-5 h-5" />
          <p className="font-medium">
            Limited Time Offer: 15% off all plans with code <span className="font-bold">PLANT15</span>
          </p>
          <div className="flex items-center gap-1">
            <span>Expires in:</span>
            <span className="font-mono bg-green-700 px-2 py-1 rounded text-white">
              {countdown.hours.toString().padStart(2, '0')}:{countdown.minutes.toString().padStart(2, '0')}:{countdown.seconds.toString().padStart(2, '0')}
            </span>
          </div>
        </div>
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
          <div className="inline-flex items-center gap-2 bg-green-100 px-4 py-2 rounded-full mb-6">
            <Badge variant="secondary">Premium Features</Badge>
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Limited Offer</Badge>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
            Unlock the Full Power of
            <span className="block text-green-600 mt-2">
              Plant Disease Detection Pro
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Get advanced features, unlimited scans, and priority processing to better protect your crops and maximize your yield.
          </p>
          
          <motion.div
            className="flex flex-col sm:flex-row items-center gap-4 w-full max-w-md mx-auto"
            variants={pulseAnimation}
            animate="visible"
          >
            <Input 
              type="email" 
              placeholder="Enter your email" 
              className="h-12 rounded-xl"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button 
              className="group w-full sm:w-auto flex items-center justify-center gap-2 h-12 px-8 rounded-xl text-lg font-semibold transition hover:bg-green-700 shadow-lg hover:shadow-green-200"
              onClick={() => {
                document.getElementById('pricing-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              View Plans
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>
          
          <div className="flex flex-wrap justify-center items-center gap-4 mt-8">
            {["24/7 Support", "Money-back Guarantee", "Secure Payment"].map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-gray-600">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* PRICING SECTION */}
      <section id="pricing-section" className="py-16 px-6 bg-white">
        <motion.div
          className="max-w-6xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerItems}
        >
          <motion.div className="text-center mb-12" variants={fadeInUp}>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Choose the Right Plan for You
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select the perfect plan to meet your agricultural needs
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
                <TabsTrigger value="annual">Annual <span className="ml-1 text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full">Save 20%</span></TabsTrigger>
              </TabsList>
            </Tabs>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Plan */}
            <motion.div 
              variants={fadeInUp} 
              custom={0}
              className={`relative ${selectedPlan === "basic" ? "ring-2 ring-green-500" : ""}`}
            >
              <Card className="p-6 shadow-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Basic</h3>
                  <p className="text-gray-500 mt-1">For hobbyists and small gardens</p>
                </div>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {paymentPeriod === "monthly" ? planDetails.basic.monthly.price : planDetails.basic.annual.price}
                  </span>
                  <span className="text-gray-500 line-through text-base">
                    {paymentPeriod === "monthly" ? planDetails.basic.monthly.original : planDetails.basic.annual.original}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {paymentPeriod === "monthly" ? planDetails.basic.monthly.period : planDetails.basic.annual.period}
                  </span>
                </div>
                
                {paymentPeriod === "annual" && (
                  <p className="text-green-600 font-medium mb-4">
                    {planDetails.basic.annual.savings}
                  </p>
                )}
                
                <Button 
                  variant={selectedPlan === "basic" ? "default" : "outline"}
                  className="w-full mb-6"
                  onClick={() => setSelectedPlan("basic")}
                >
                  {selectedPlan === "basic" ? "Selected" : "Select"}
                </Button>
                
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <h4 className="font-medium text-gray-700 mb-4">Features:</h4>
                  <ul className="space-y-3">
                    {planDetails.basic.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
            
            {/* Pro Plan */}
            <motion.div 
              variants={fadeInUp} 
              custom={1}
              className={`relative ${selectedPlan === "pro" ? "ring-2 ring-green-500" : ""}`}
            >
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1">MOST POPULAR</Badge>
              </div>
              <Card className="p-6 shadow-xl rounded-3xl border-t-4 border-green-500 overflow-hidden h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Pro</h3>
                  <p className="text-gray-500 mt-1">For serious growers and farms</p>
                </div>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-green-600">
                    {paymentPeriod === "monthly" ? planDetails.pro.monthly.price : planDetails.pro.annual.price}
                  </span>
                  <span className="text-gray-500 line-through text-base">
                    {paymentPeriod === "monthly" ? planDetails.pro.monthly.original : planDetails.pro.annual.original}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {paymentPeriod === "monthly" ? planDetails.pro.monthly.period : planDetails.pro.annual.period}
                  </span>
                </div>
                
                {paymentPeriod === "annual" && (
                  <p className="text-green-600 font-medium mb-4">
                    {planDetails.pro.annual.savings}
                  </p>
                )}
                
                <Button 
                  variant={selectedPlan === "pro" ? "default" : "outline"}
                  className="w-full mb-6"
                  onClick={() => setSelectedPlan("pro")}
                >
                  {selectedPlan === "pro" ? "Selected" : "Select"}
                </Button>
                
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <h4 className="font-medium text-gray-700 mb-4">Everything in Basic, plus:</h4>
                  <ul className="space-y-3">
                    {planDetails.pro.features.slice(1).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
            
            {/* Enterprise Plan */}
            <motion.div 
              variants={fadeInUp} 
              custom={2}
              className={`relative ${selectedPlan === "enterprise" ? "ring-2 ring-green-500" : ""}`}
            >
              <Card className="p-6 shadow-xl rounded-3xl overflow-hidden h-full flex flex-col">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900">Enterprise</h3>
                  <p className="text-gray-500 mt-1">For large scale operations</p>
                </div>
                
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-extrabold text-gray-900">
                    {paymentPeriod === "monthly" ? planDetails.enterprise.monthly.price : planDetails.enterprise.annual.price}
                  </span>
                  <span className="text-gray-500 line-through text-base">
                    {paymentPeriod === "monthly" ? planDetails.enterprise.monthly.original : planDetails.enterprise.annual.original}
                  </span>
                  <span className="text-gray-500 text-sm">
                    {paymentPeriod === "monthly" ? planDetails.enterprise.monthly.period : planDetails.enterprise.annual.period}
                  </span>
                </div>
                
                {paymentPeriod === "annual" && (
                  <p className="text-green-600 font-medium mb-4">
                    {planDetails.enterprise.annual.savings}
                  </p>
                )}
                
                <Button 
                  variant={selectedPlan === "enterprise" ? "default" : "outline"}
                  className="w-full mb-6"
                  onClick={() => setSelectedPlan("enterprise")}
                >
                  {selectedPlan === "enterprise" ? "Selected" : "Select"}
                </Button>
                
                <div className="border-t border-gray-200 pt-4 mt-auto">
                  <h4 className="font-medium text-gray-700 mb-4">Everything in Pro, plus:</h4>
                  <ul className="space-y-3">
                    {planDetails.enterprise.features.slice(1).map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            </motion.div>
          </div>
          
          <motion.div
            className="mt-12 max-w-2xl mx-auto bg-green-50 rounded-2xl p-6"
            variants={fadeInUp}
          >
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-grow">
                <h3 className="text-lg font-medium text-green-800 mb-2">Have a coupon code?</h3>
                <div className="flex gap-2">
                  <Input 
                    placeholder="Enter coupon code" 
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
                </div>
                {discountApplied && (
                  <p className="text-green-600 text-sm mt-2">15% discount applied!</p>
                )}
              </div>
              
              <div className="md:border-l md:pl-4 md:border-green-200">
                <Button 
                  className="w-full h-full group flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-lg font-semibold transition hover:bg-green-700 shadow-lg hover:shadow-green-200"
                  onClick={handlePayment}
                  disabled={isLoading}
                >
                  {isLoading ? "Processing..." : "Subscribe Now"}
                  {!isLoading && (
                    <CreditCard className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  )}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap justify-center items-center gap-4 mt-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Gift className="w-4 h-4" />
                <span>7-day money-back guarantee</span>
              </div>
              <div className="flex items-center gap-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Secure payment with Razorpay</span>
              </div>
              <div className="flex items-center gap-1">
                <Lock className="w-4 h-4" />
                <span>SSL Encrypted</span>
              </div>
            </div>
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
            <Badge variant="outline" className="mb-4">Premium Features</Badge>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Everything You Need for Plant Health
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Unlock these powerful tools to revolutionize your plant disease management
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
                <Card className="p-6 shadow-lg rounded-xl bg-white h-full flex flex-col hover:shadow-xl transition-shadow">
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

      {/* TESTIMONIALS */}
      <section className="py-16 px-6 bg-white" ref={testimonialsRef}>
        <div className="max-w-6xl mx-auto">
          <motion.div className="text-center mb-16" initial={{ opacity: 0 }} animate={isTestimonialsInView ? { opacity: 1 } : { opacity: 0 }}>
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Trusted by Farmers & Growers
            </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                See what our customers are saying about Plant Disease Detection Pro
              </p>
            </motion.div>

            <motion.div 
              className="grid md:grid-cols-3 gap-8"
              initial="hidden"
              animate={isTestimonialsInView ? "visible" : "hidden"}
              variants={staggerItems}
            >
              {testimonials.map((testimonial, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp} 
                  custom={index}
                >
                  <Card className="p-6 shadow-lg rounded-xl bg-white h-full flex flex-col">
                    <div className="flex items-center gap-4 mb-4">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name} 
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                        <p className="text-gray-500 text-sm">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic flex-grow">"{testimonial.content}"</p>
                    <div className="flex mt-4">
                      {[...Array(5)].map((_, i) => (
                        <Award key={i} className="w-5 h-5 text-yellow-400" />
                      ))}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
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
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about our subscription plans
            </p>
          </motion.div>

          <motion.div variants={fadeInUp}>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  What payment methods do you accept?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  We accept all major credit cards, debit cards, UPI, and net banking through our secure payment processor, Razorpay.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  Can I cancel my subscription at any time?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, you can cancel your subscription at any time from your account dashboard. If you cancel within the first 7 days, we offer a full refund. After 7 days, your subscription will continue until the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  How accurate is the plant disease detection?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Our AI model has been trained on millions of plant images and can identify over 50 common plant diseases with an accuracy rate of 95%+. Pro and Enterprise plans have access to our most advanced AI models with even higher accuracy rates.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  Can I upgrade my plan later?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, you can upgrade your plan at any time. You'll only pay the prorated difference for the remainder of your billing period. Downgrades take effect at the end of your current billing period.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  Is my data secure?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, we take data security very seriously. All your plant images and scan results are stored securely and encrypted. We do not share your data with third parties. Enterprise customers can also opt for additional data security measures.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-6">
                <AccordionTrigger className="text-left text-lg font-medium text-gray-900">
                  Do you offer discounts for educational institutions?
                </AccordionTrigger>
                <AccordionContent className="text-gray-600">
                  Yes, we offer special pricing for educational institutions and research organizations. Please contact our sales team at sales@plantdisease.ai for more information.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </motion.div>
        </motion.div>
      </section>

      {/* CALL TO ACTION */}
      <section className="py-16 px-6 bg-green-600 text-white">
        <motion.div
          className="max-w-4xl mx-auto text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={fadeInUp}
        >
          <h2 className="text-4xl font-bold mb-6">
            Ready to Transform Your Plant Health Management?
          </h2>
          <p className="text-xl mb-8 text-green-100 max-w-2xl mx-auto">
            Join thousands of farmers and growers who have already improved their yields and reduced pesticide use with our AI-powered solution.
          </p>
          
          <motion.div
            className="bg-white rounded-2xl p-8 shadow-2xl max-w-3xl mx-auto"
            variants={pulseAnimation}
            animate="visible"
          >
            <h3 className="text-2xl font-bold text-green-800 mb-4">
              Subscribe to the {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} Plan Today
            </h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-gray-600 mb-2">Selected Plan:</p>
                <p className="text-2xl font-bold text-green-700">
                  {selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)} - {paymentPeriod === "monthly" ? "Monthly" : "Annual"}
                </p>
                <p className="text-gray-500 mt-1">
                  {paymentPeriod === "monthly" 
                    ? planDetails[selectedPlan].monthly.price + planDetails[selectedPlan].monthly.period
                    : planDetails[selectedPlan].annual.price + planDetails[selectedPlan].annual.period
                  }
                </p>
                {discountApplied && (
                  <Badge className="bg-green-100 text-green-800 mt-2">15% Discount Applied</Badge>
                )}
              </div>
              
              <div>
                <p className="text-gray-600 mb-2">Enter your email:</p>
                <Input 
                  type="email" 
                  placeholder="Your email address" 
                  className="mb-2"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <p className="text-xs text-gray-500">
                  We'll send your receipt and account details to this email.
                </p>
              </div>
            </div>
            
            <Button 
              className="w-full py-6 text-lg font-semibold flex items-center justify-center gap-2"
              onClick={handlePayment}
              disabled={isLoading}
            >
              {isLoading ? "Processing..." : "Complete Subscription"}
              {!isLoading && <ArrowRight className="w-5 h-5" />}
            </Button>
            
            <div className="flex justify-center mt-4 text-sm text-gray-500">
              <p>By subscribing, you agree to our Terms of Service and Privacy Policy</p>
            </div>
          </motion.div>
          
          <div className="mt-8 flex flex-wrap justify-center gap-8">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6" />
              <span>Secure Payment</span>
            </div>
            <div className="flex items-center gap-2">
              <Gift className="w-6 h-6" />
              <span>7-Day Money Back</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6" />
              <span>24/7 Support</span>
            </div>
          </div>
        </motion.div>
      </section>
    </Layout>
  );
};

export default SubscribePro;