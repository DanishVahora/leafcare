import React, { useRef, useState, useEffect } from 'react';
import Layout from '@/Layout/Layout';
import emailjs from '@emailjs/browser';
import { Send, CheckCircle, MapPin, Phone, Mail, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Contact: React.FC = () => {
    const form = useRef<HTMLFormElement>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');
    const [scrollProgress, setScrollProgress] = useState(0);
    const [activeForm, setActiveForm] = useState<'general' | 'support'>('general');

    useEffect(() => {
        const handleScroll = () => {
            const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;
            const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            setScrollProgress((totalScroll / windowHeight) * 100);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const sendEmail = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (form.current) {
                await emailjs.sendForm(
                    'service_qnllp6d', // Replace with your EmailJS service ID
                    'template_wl829tw', // Replace with your EmailJS template ID
                    form.current,
                    'sInf_kZ0ADocq31Qp' // Replace with your EmailJS public key
                );
                setIsSuccess(true);
                form.current.reset();
            }
        } catch (error) {
            setError('Failed to send message. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

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

    const handleReset = () => {
        setIsSuccess(false);
    };

    return (
        <Layout>
            {/* Scroll Progress Bar - same as homepage */}
            <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-gray-200">
                <div
                    className="h-full bg-green-600 transition-all duration-200"
                    style={{ width: `${scrollProgress}%` }}
                />
            </div>

            {/* HERO SECTION - with contact heading */}
            <section className="container mx-auto px-4 sm:px-6 py-8 md:py-16">
                <motion.div
                    className="text-center"
                    initial="hidden"
                    animate="visible"
                    variants={fadeInUp}
                    transition={{ duration: 0.8 }}
                >
                    <div className="inline-flex items-center gap-2 bg-green-100 px-3 py-1.5 md:px-4 md:py-2 rounded-full mb-6">
                        <Badge variant="secondary" className="text-xs md:text-sm">Get in Touch</Badge>
                        <Badge variant="outline" className="text-xs">24/7</Badge>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-gray-900">
                        Contact Us
                        <span className="block text-xl sm:text-2xl md:text-4xl text-green-600 mt-2">
                            We're Here to Help
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mt-4 mb-8 leading-relaxed">
                        Have questions about our plant disease detection technology or need support? Our team is ready to assist you.
                    </p>
                </motion.div>
            </section>

            {/* CONTACT FORM & INFO SECTION */}
            <section className="bg-gray-50 py-8 md:py-16 px-4 sm:px-6">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerItems}
                >
                    {/* Two-column layout for desktop, stacked for mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
                        {/* Left column: Contact Form */}
                        <motion.div variants={fadeInUp}>
                            <Card className="p-6 md:p-8 shadow-xl rounded-xl overflow-hidden bg-white">
                                {/* Form type selector */}
                                <div className="flex rounded-lg bg-gray-100 p-1 mb-6">
                                    <button
                                        onClick={() => setActiveForm('general')}
                                        className={`flex-1 py-2 text-sm md:text-base font-medium rounded-md transition-colors ${activeForm === 'general'
                                                ? 'bg-white text-green-700 shadow-sm'
                                                : 'text-gray-600 hover:text-green-600'
                                            }`}
                                    >
                                        General Inquiry
                                    </button>
                                    <button
                                        onClick={() => setActiveForm('support')}
                                        className={`flex-1 py-2 text-sm md:text-base font-medium rounded-md transition-colors ${activeForm === 'support'
                                                ? 'bg-white text-green-700 shadow-sm'
                                                : 'text-gray-600 hover:text-green-600'
                                            }`}
                                    >
                                        Technical Support
                                    </button>
                                </div>

                                <h2 className="text-2xl font-bold text-green-800 mb-6">
                                    {activeForm === 'general' ? 'Send Us a Message' : 'Request Technical Support'}
                                </h2>

                                {isSuccess ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-green-50 border border-green-100 rounded-xl p-8 text-center"
                                    >
                                        <div className="flex justify-center mb-4">
                                            <CheckCircle className="h-16 w-16 text-green-500" />
                                        </div>
                                        <h3 className="text-xl font-medium text-green-800 mb-2">Message Sent Successfully!</h3>
                                        <p className="text-green-700 mb-6">Thank you for reaching out. We'll get back to you as soon as possible.</p>
                                        <button
                                            onClick={handleReset}
                                            className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2 mx-auto"
                                        >
                                            Send Another Message
                                            <ArrowRight className="w-4 h-4" />
                                        </button>
                                    </motion.div>
                                ) : (
                                    <form ref={form} onSubmit={sendEmail} className="space-y-5">
                                        {error && (
                                            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg flex items-center gap-2">
                                                <AlertCircle className="h-5 w-5" />
                                                {error}
                                            </div>
                                        )}

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                            <div>
                                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Full Name*
                                                </label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="John Doe"
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Email Address*
                                                </label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    required
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="john@example.com"
                                                />
                                            </div>
                                        </div>

                                        {activeForm === 'support' && (
                                            <div>
                                                <label htmlFor="order_id" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Order ID / Account Number
                                                </label>
                                                <input
                                                    type="text"
                                                    name="order_id"
                                                    id="order_id"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                    placeholder="If applicable"
                                                />
                                            </div>
                                        )}

                                        <div>
                                            <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                                                Subject*
                                            </label>
                                            <input
                                                type="text"
                                                name="subject"
                                                id="subject"
                                                required
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                                placeholder={activeForm === 'general' ? "How can we help you?" : "Describe your issue"}
                                            />
                                        </div>

                                        <div>
                                            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                                                Message*
                                            </label>
                                            <textarea
                                                name="message"
                                                id="message"
                                                required
                                                rows={5}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                                                placeholder={activeForm === 'general' ? "Your message..." : "Please provide details about your technical issue..."}
                                            />
                                        </div>

                                        {activeForm === 'support' && (
                                            <div>
                                                <label htmlFor="attachment" className="block text-sm font-medium text-gray-700 mb-1">
                                                    Attachment (Optional)
                                                </label>
                                                <input
                                                    type="file"
                                                    name="attachment"
                                                    id="attachment"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                                                />
                                                <p className="text-xs text-gray-500 mt-1">Upload screenshots or relevant files (Max: 5MB)</p>
                                            </div>
                                        )}

                                        <div className="flex items-start">
                                            <input
                                                type="checkbox"
                                                id="privacy"
                                                required
                                                className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                            />
                                            <label htmlFor="privacy" className="ml-2 text-sm text-gray-600">
                                                I agree to the <a href="#" className="text-green-600 hover:underline">Privacy Policy</a> and consent to being contacted regarding my inquiry.
                                            </label>
                                        </div>

                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Sending...
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="h-5 w-5" />
                                                    {activeForm === 'general' ? 'Send Message' : 'Submit Support Request'}
                                                </>
                                            )}
                                        </button>
                                    </form>
                                )}
                            </Card>
                        </motion.div>

                        {/* Right column: Contact Information */}
                        <motion.div variants={fadeInUp} className="space-y-6">
                            {/* Contact Info Card */}
                            <Card className="p-6 md:p-8 shadow-xl rounded-xl bg-white border-t-4 border-green-500">
                                <h2 className="text-2xl font-bold text-green-800 mb-6">Contact Information</h2>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <MapPin className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-800">Our Location</h3>
                                            <p className="text-gray-600 mt-1">
                                                1234 Green Technology Park<br />
                                                Suite 500<br />
                                                San Francisco, CA 94107
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <Phone className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-800">Phone</h3>
                                            <p className="text-gray-600 mt-1">
                                                Main: +1 (555) 123-4567<br />
                                                Support: 1-800-PLANT-AI (752-6824)
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <Mail className="h-6 w-6 text-green-600" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-lg text-gray-800">Email</h3>
                                            <p className="text-gray-600 mt-1">
                                                General: info@plantai.com<br />
                                                Support: support@plantai.com<br />
                                                Research: research@plantai.com
                                            </p>
                                        </div>
                                    </div>

                                    {/* <div className="flex items-start gap-4">
                    <div className="bg-green-100 p-3 rounded-full">
                      <Clock className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-medium text-lg text-gray-800">Business Hours</h3>
                      <p className="text-gray-600 mt-1">
                        Monday - Friday: 9:00 AM - 6:00 PM<br />
                        Saturday: 10:00 AM - 2:00 PM<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div> */}
                                </div>
                            </Card>

                            {/* Stats Card */}
                            {/* <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="p-6 shadow-lg rounded-xl bg-white">
                  <h3 className="text-xl font-semibold text-green-700 mb-4">Why Choose Us</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[['98%', 'Accuracy'], ['24/7', 'Support'], ['50k+', 'Users']].map(([value, label]) => (
                      <div key={label} className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-xl font-bold text-green-600">{value}</div>
                        <div className="text-sm text-gray-600">{label}</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div> */}
                            <br />

                            {/* Social Media */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Card className="p-6 shadow-lg rounded-xl bg-white">
                                    <h2 className="text-2xl font-bold text-green-800 mb-6">Connect With Us</h2>
                                    <div className="flex gap-4 justify-center">
                                        {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                                            <a
                                                key={platform}
                                                href="#"
                                                className="bg-green-100 hover:bg-green-200 p-3 rounded-full transition-colors"
                                                aria-label={`Visit our ${platform} page`}
                                            >
                                                <svg className="h-5 w-5 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                                    {platform === 'facebook' && <path d="M22.675 0h-21.35c-.732 0-1.325.593-1.325 1.325v21.351c0 .731.593 1.324 1.325 1.324h11.495v-9.294h-3.128v-3.622h3.128v-2.671c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.313h3.587l-.467 3.622h-3.12v9.293h6.116c.73 0 1.323-.593 1.323-1.325v-21.35c0-.732-.593-1.325-1.325-1.325z" />}
                                                    {platform === 'twitter' && <path d="M23.954 4.569c-.885.389-1.83.654-2.825.775 1.014-.611 1.794-1.574 2.163-2.723-.951.555-2.005.959-3.127 1.184-.896-.959-2.173-1.559-3.591-1.559-2.717 0-4.92 2.203-4.92 4.917 0 .39.045.765.127 1.124-4.09-.193-7.715-2.157-10.141-5.126-.427.722-.666 1.561-.666 2.475 0 1.71.87 3.213 2.188 4.096-.807-.026-1.566-.248-2.228-.616v.061c0 2.385 1.693 4.374 3.946 4.827-.413.111-.849.171-1.296.171-.314 0-.615-.03-.916-.086.631 1.953 2.445 3.377 4.604 3.417-1.68 1.319-3.809 2.105-6.102 2.105-.39 0-.779-.023-1.17-.067 2.189 1.394 4.768 2.209 7.557 2.209 9.054 0 14-7.503 14-14v-.617c.961-.689 1.8-1.56 2.46-2.548l-.047-.02z" />}
                                                    {platform === 'linkedin' && <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />}
                                                    {platform === 'instagram' && <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />}
                                                </svg>
                                            </a>
                                        ))}
                                    </div>
                                </Card>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.div>
            </section>

            {/* FAQ SECTION */}
            <section className="py-8 md:py-16 px-4 sm:px-6">
                <motion.div
                    className="max-w-4xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={staggerItems}
                >
                    <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-green-800">
                        Frequently Asked Questions
                    </motion.h2>

                    <div className="space-y-4 md:space-y-6">
                        {[
                            {
                                question: "How quickly will I receive a response?",
                                answer: "We aim to respond to all inquiries within 24-48 business hours. For urgent technical support, please contact our 24/7 support line at 1-800-PLANT-AI."
                            },
                            {
                                question: "Do you offer API access to your plant disease detection model?",
                                answer: "Yes, we provide API access for developers and businesses who want to integrate our plant disease detection capabilities into their applications. Contact our sales team for pricing and documentation."
                            },
                            {
                                question: "What plant species does your technology support?",
                                answer: "Our AI model currently supports 38 different plant species and can detect over 150 different diseases. We're continuously expanding our dataset to include more species and disease variants."
                            },
                            {
                                question: "Is there a mobile app available?",
                                answer: "Yes, our mobile application is available for both iOS and Android devices. You can download it from the respective app stores and start detecting plant diseases instantly with your smartphone camera."
                            }
                        ].map((faq, index) => (
                            <motion.div
                                key={index}
                                variants={fadeInUp}
                                custom={index}
                                className="bg-white rounded-xl shadow-lg overflow-hidden"
                            >
                                <Card className="p-6 hover:shadow-xl transition-shadow">
                                    <h3 className="text-lg md:text-xl font-semibold text-green-700 mb-2">{faq.question}</h3>
                                    <p className="text-gray-600">{faq.answer}</p>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>
            </section>

            {/* MAP SECTION */}
            <section className="bg-gray-50 py-8 md:py-16 px-4 sm:px-6">
                <motion.div
                    className="max-w-6xl mx-auto"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <motion.h2 variants={fadeInUp} className="text-2xl md:text-4xl font-bold text-center mb-6 text-green-800">
                        Find Us
                    </motion.h2>
                    <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
                        Visit our headquarters to learn more about our plant disease detection technology and meet our team of experts.
                    </p>
                    <div className="w-full h-28 sm:h-90 rounded-xl overflow-hidden shadow-lg border border-white/10"> {/* Reduced height */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1842.0696039060686!2d72.97100043852579!3d22.573896221587027!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e4ebf003be167%3A0x33cf97439d4e96e2!2sRoyal%20City%2C%20Chandralok%20Society%2C%20Ismaile%20Nagar%2C%20Gamdi%2C%20Anand%2C%20Gujarat%20388001!5e0!3m2!1sen!2sin!4v1742906429288!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </motion.div>
            </section>

            {/* CALL TO ACTION */}
            <section className="py-12 md:py-20 px-4 sm:px-6">
                <motion.div
                    className="max-w-4xl mx-auto text-center"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.2 }}
                    variants={fadeInUp}
                >
                    <h2 className="text-2xl md:text-4xl font-bold mb-6 text-green-800">
                        Ready to Transform Plant Disease Management?
                    </h2>
                    <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                        Join thousands of farmers, researchers, and plant enthusiasts using our AI technology to detect and manage plant diseases efficiently.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-medium px-6 py-3 rounded-lg text-base transition-all duration-200 flex items-center justify-center gap-2">
                            Get Started Now
                            <ArrowRight className="w-4 h-4" />
                        </button>
                        <button className="w-full sm:w-auto bg-transparent hover:bg-green-50 text-green-800 font-medium px-6 py-3 rounded-lg text-base border border-green-300 transition-all duration-200">
                            Request a Demo
                        </button>
                    </div>
                </motion.div>
            </section>
        </Layout>
    );
};

export default Contact;