"use client";

import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  HelpCircle,
  Mail,
  MessageCircle,
  Package,
  Search,
  Send,
  Truck,
} from "lucide-react";

import Footer from "@/components/landing/Footer/Footer";
import LoginOfferBar from "@/components/landing/LoginOfferBar/LoginOfferBar";
import Navbar from "@/components/landing/Navbar/Navbar";
import { AccountMenu } from "@/components/profile/AccountMenu/AccountMenu";
import { apiClient } from "@/services/api-client";
import { logoutApi } from "@/services/auth";
import { getProfileApi } from "@/services/profile";

interface FAQItem {
  id: number;
  category:
    | "Orders & Payments"
    | "Shipping & Delivery"
    | "Replace & Refunds"
    | "Account";
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  // ── Orders & Payments ──
  {
    id: 1,
    category: "Orders & Payments",
    question: "How do I place an order?",
    answer:
      "Browsing and placing an order on Luuna is simple! Browse our collections, select your desired item, choose your variant/size if applicable, and click 'Add to Cart'. When you are ready, proceed to your Cart, click 'Checkout', provide your shipping address, choose your preferred payment method, and confirm your order. You will receive an instant confirmation email and order number.",
  },
  {
    id: 2,
    category: "Orders & Payments",
    question: "How can I track my order?",
    answer:
      "You can track your order at any time by visiting your profile and clicking 'My Orders'. Each order displays real-time tracking milestones (Placed, Processing, Shipped, Delivered) along with courier details and tracking numbers once dispatched.",
  },
  {
    id: 3,
    category: "Orders & Payments",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major secure payment methods: UPI (Google Pay, PhonePe, Paytm, BHIM), Credit/Debit Cards (Visa, Mastercard, RuPay, Maestro), Net Banking from all leading Indian banks, and Cash on Delivery (COD) for eligible pin codes.",
  },
  {
    id: 4,
    category: "Orders & Payments",
    question: "Can I modify or cancel my order?",
    answer:
      "Yes, you can cancel your order directly from the 'My Orders' section in your profile as long as it is still in 'Pending' or 'Processing' status. Once an order is Shipped or out for delivery, it cannot be modified or cancelled, but you may request a replacement or return once delivered.",
  },
  {
    id: 5,
    category: "Orders & Payments",
    question:
      "What should I do if my payment is successful but my order isn't confirmed?",
    answer:
      "Don't worry! In rare instances, bank gateways may experience a brief synchronization delay. Please wait 10 to 15 minutes and refresh your 'My Orders' page. If the order still does not appear, please send your payment transaction ID or UPI reference to our support email at luuna@gmail.com, and our team will resolve it or process an immediate refund.",
  },

  // ── Shipping & Delivery ──
  {
    id: 6,
    category: "Shipping & Delivery",
    question: "Do you deliver across India?",
    answer:
      "Yes, we are doing delivery PAN India! We cover all states, union territories, metro cities, and regional pin codes through our trusted express logistics partners.",
  },
  {
    id: 7,
    category: "Shipping & Delivery",
    question: "How long does delivery take?",
    answer:
      "Standard delivery typically takes approximately 5 to 7 business days from the date of dispatch, depending on your shipping destination and regional connectivity.",
  },
  {
    id: 8,
    category: "Shipping & Delivery",
    question: "How can I track my shipment?",
    answer:
      "Once your package is dispatched, you will receive an SMS and email notification with your tracking details. You can also view live tracking updates, courier company name, and airway bill (AWB) number under 'My Orders' > 'View Details'.",
  },

  // ── Replace & Refunds ──
  {
    id: 9,
    category: "Replace & Refunds",
    question: "What is your replacement policy?",
    answer:
      "We offer a customer-friendly 7-day replacement policy for all eligible items. If your item is defective, damaged in transit, or has missing components, you can request a replacement within 7 days of delivery with original packaging and tags intact.",
  },
  {
    id: 10,
    category: "Replace & Refunds",
    question: "What if I receive a damaged or incorrect product?",
    answer:
      "We sincerely apologize if this happens! Please contact our customer support team at luuna@gmail.com within 48 hours of delivery with photos or a short unboxing video of the damaged/incorrect product and your order ID. We will promptly arrange a free reverse pickup and dispatch a replacement or issue a full refund.",
  },
  {
    id: 11,
    category: "Replace & Refunds",
    question: "How long does a refund take?",
    answer:
      "Once a return or cancellation is approved, refunds are initiated immediately. For UPI and debit cards, the amount reflects within 2 to 4 business days. For credit cards and net banking, it typically reflects in your bank statement within 5 to 7 business days.",
  },

  // ── Account ──
  {
    id: 12,
    category: "Account",
    question: "How do I create an account?",
    answer:
      "Creating an account is quick and free! Click on 'Register' or 'Login' in the top header, enter your email and a strong password, and click Sign Up. You can also complete your profile details and shipping addresses under 'My Profile'.",
  },
  {
    id: 13,
    category: "Account",
    question: "How can I change my registered phone number or email?",
    answer:
      "You can update your personal contact details including mobile number, address, and profile photo anytime by visiting 'My Profile' and clicking 'Save Changes'. For email changes, please contact support at luuna@gmail.com for account verification assistance.",
  },
  {
    id: 14,
    category: "Account",
    question: "How can I delete my account?",
    answer:
      "If you wish to delete your account and associated personal data, please contact our support desk at luuna@gmail.com with the subject 'Account Deletion Request'. Our team will process your request within 48 business hours in accordance with our privacy policy.",
  },
];

type CategoryFilter = "ALL" | FAQItem["category"];

export default function HelpSupportPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryFilter>("ALL");
  const [openFaqId, setOpenFaqId] = useState<number | null>(1); // Open first question by default

  // Contact form state
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactCategory, setContactCategory] = useState("Orders & Payments");
  const [contactMessage, setContactMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [formFeedback, setFormFeedback] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Auto-fill user info if logged in (with AbortController cancellation and unmount protection)
  useEffect(() => {
    const controller = new AbortController();
    let isMounted = true;

    async function loadProfile() {
      try {
        const profile = await getProfileApi({
          signal: controller.signal,
        });

        if (!isMounted) return;
        if (profile?.name) setContactName(profile.name);
        if (profile?.email) setContactEmail(profile.email);
      } catch (err: any) {
        if (!controller.signal.aborted && isMounted) {
          // Allow guest access - unauthenticated users can still submit inquiries
        }
      }
    }

    loadProfile();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch {
      // Ignore
    } finally {
      window.location.href = "/";
    }
  };

  const toggleFaq = (id: number) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  };

  // Filter FAQs based on category and search query
  const filteredFaqs = useMemo(() => {
    return FAQS.filter((faq) => {
      const matchesCategory =
        selectedCategory === "ALL" || faq.category === selectedCategory;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query) ||
        faq.category.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactMessage.trim()) return;

    setIsSending(true);
    setFormFeedback(null);

    try {
      // Connect to backend support API
      await apiClient("/support/contact", {
        method: "POST",
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          subject: contactCategory,
          message: contactMessage,
        }),
      });

      // Only show success after the backend confirms submission
      setFormFeedback({
        type: "success",
        text: "Thank you! Your message has been received. Our support team will reply to your email shortly.",
      });
      setContactMessage("");
    } catch {
      // If backend support API is not available or encounters an error, show honest message
      setFormFeedback({
        type: "error",
        text: "Support submission is currently unavailable. Please contact us through our official support channel.",
      });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <LoginOfferBar />
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-[#2a1740] via-[#755494] to-[#E9D5FF] pb-16 pt-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Back Button */}
        <div className="max-w-6xl mx-auto mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm font-semibold text-white hover:text-[#E9D5FF] transition-colors"
          >
            <ChevronLeft size={16} className="mr-1" />
            Back to Home
          </Link>
        </div>

        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 sm:gap-6">
          {/* Left Sidebar Navigation */}
          <div className="w-full md:w-64 lg:w-72 shrink-0">
            <h2 className="text-xl font-bold text-white mb-4 px-1 tracking-tight hidden md:block">
              Manage My Account
            </h2>
            <AccountMenu onLogout={handleLogout} />
          </div>

          {/* Right Main Content area */}
          <div className="flex-1 bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 min-h-[560px] flex flex-col min-w-0">
            {/* Header */}
            <div className="pb-6 border-b border-gray-100 mb-6">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
                  Help & Support
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#F3E8FF] text-[#6B21A8]">
                  <HelpCircle size={12} />
                  FAQs & Assistance
                </span>
              </div>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Got a question? Explore frequently asked questions below or
                connect with our support desk.
              </p>
            </div>

            {/* Quick Contact Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {/* Card 1: Email Support */}
              <div className="border border-[#E9D5FF] bg-gradient-to-br from-[#FAF5FF] to-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-[#F3E8FF] text-[#6B21A8] flex items-center justify-center mb-3">
                    <Mail size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    Email Support
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Typically replies within 24 business hours
                  </p>
                  <p className="text-xs font-semibold text-[#6B21A8] mt-2 select-all">
                    luuna@gmail.com
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-50">
                  <a
                    href="mailto:luuna@gmail.com"
                    className="inline-flex items-center justify-center w-full gap-1.5 py-2 px-3 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Mail size={13} />
                    Email Us
                  </a>
                </div>
              </div>

              {/* Card 2: WhatsApp Support */}
              <div className="border border-emerald-100 bg-gradient-to-br from-emerald-50/40 to-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <MessageCircle size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    WhatsApp Desk
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Mon – Sat: 9:00 AM – 7:00 PM IST
                  </p>
                  <p className="text-xs font-semibold text-emerald-700 mt-2 select-all">
                    +91 98765 43210
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-emerald-50">
                  <a
                    href="https://wa.me/919876543210"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center w-full gap-1.5 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <MessageCircle size={13} />
                    Chat on WhatsApp
                  </a>
                </div>
              </div>

              {/* Card 3: PAN India Delivery & Tracking */}
              <div className="border border-purple-100 bg-gradient-to-br from-purple-50/30 to-white rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all sm:col-span-2 lg:col-span-1">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-3">
                    <Truck size={20} />
                  </div>
                  <h3 className="text-sm font-bold text-gray-900">
                    PAN India Delivery
                  </h3>
                  <p className="text-xs text-gray-500 mt-1">
                    Average delivery within 5 to 7 days
                  </p>
                  <p className="text-xs font-semibold text-purple-700 mt-2">
                    Live Courier Tracking Active
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-purple-50">
                  <Link
                    href="/profile/myorders"
                    className="inline-flex items-center justify-center w-full gap-1.5 py-2 px-3 rounded-xl bg-purple-700 hover:bg-purple-800 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Package size={13} />
                    Track My Order
                  </Link>
                </div>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative mb-4">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search questions (e.g. delivery time, track order, refund, pan india)..."
                className="w-full bg-[#fdfcff] border border-gray-200 text-xs sm:text-sm rounded-xl py-2.5 pl-10 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] transition-colors"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-gray-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-3 overflow-x-auto scrollbar-none">
              {(
                [
                  "ALL",
                  "Orders & Payments",
                  "Shipping & Delivery",
                  "Replace & Refunds",
                  "Account",
                ] as const
              ).map((cat) => {
                const isSelected = selectedCategory === cat;
                const count =
                  cat === "ALL"
                    ? FAQS.length
                    : FAQS.filter((f) => f.category === cat).length;

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                      isSelected
                        ? "bg-[#6B21A8] text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {cat === "ALL" ? "All Questions" : cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* FAQ Accordion List */}
            <div className="flex flex-col gap-3 mb-10">
              {filteredFaqs.length === 0 ? (
                <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
                  <HelpCircle
                    size={32}
                    className="mx-auto text-gray-400 mb-2"
                  />
                  <p className="text-sm font-semibold text-gray-700">
                    No matching questions found
                  </p>
                  <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                    Try searching with different keywords, or send us a message
                    directly below.
                  </p>
                </div>
              ) : (
                filteredFaqs.map((faq) => {
                  const isOpen = openFaqId === faq.id;

                  return (
                    <div
                      key={faq.id}
                      className={`border rounded-2xl transition-all duration-200 overflow-hidden ${
                        isOpen
                          ? "border-[#D8B4FE] bg-[#FAF5FF]/40 shadow-xs"
                          : "border-gray-200/90 bg-white hover:border-gray-300"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(faq.id)}
                        className="w-full text-left px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
                          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#F3E8FF] text-[#6B21A8] text-xs font-bold shrink-0 mt-0.5">
                            {faq.id}
                          </span>
                          <div>
                            <span className="text-[10px] font-bold text-[#6B21A8] uppercase tracking-wider block mb-0.5">
                              {faq.category}
                            </span>
                            <h3 className="text-xs sm:text-sm font-bold text-gray-900 leading-snug">
                              {faq.question}
                            </h3>
                          </div>
                        </div>

                        <div className="shrink-0 text-gray-400 p-1">
                          {isOpen ? (
                            <ChevronUp size={18} className="text-[#6B21A8]" />
                          ) : (
                            <ChevronDown size={18} />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="px-4 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-purple-100/60 pl-11 sm:pl-12">
                          <p>{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Direct Message Form Section */}
            <div className="border border-purple-100 bg-gradient-to-br from-[#FAF5FF] via-white to-white rounded-2xl p-5 sm:p-6 mt-auto">
              <div className="flex items-center gap-2 mb-1">
                <Send size={16} className="text-[#6B21A8]" />
                <h3 className="text-base font-bold text-gray-900">
                  Still have questions? Send us a message
                </h3>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Our support team is always ready to help you with order
                inquiries, delivery updates, and product questions.
              </p>

              {formFeedback && (
                <div
                  className={`mb-4 p-4 rounded-xl border text-xs sm:text-sm font-medium flex items-start sm:items-center gap-3 transition-all ${
                    formFeedback.type === "success"
                      ? "bg-green-50 border-green-200 text-green-800"
                      : "bg-amber-50 border-amber-200 text-amber-900"
                  }`}
                >
                  {formFeedback.type === "success" ? (
                    <CheckCircle2
                      size={18}
                      className="text-green-600 shrink-0 mt-0.5 sm:mt-0"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      className="text-amber-600 shrink-0 mt-0.5 sm:mt-0"
                    />
                  )}
                  <div className="flex-1">
                    <span>{formFeedback.text}</span>
                    {formFeedback.type === "error" && (
                      <div className="mt-2.5 flex flex-wrap items-center gap-2 pt-2 border-t border-amber-200/60">
                        <a
                          href={`mailto:luuna@gmail.com?subject=${encodeURIComponent(
                            `Support Request: ${contactCategory}`,
                          )}&body=${encodeURIComponent(
                            `Name: ${contactName}\nEmail: ${contactEmail}\n\nMessage:\n${contactMessage}`,
                          )}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#6B21A8] hover:bg-[#581c87] text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <Mail size={12} />
                          Email luuna@gmail.com
                        </a>
                        <a
                          href="https://wa.me/919876543210"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                        >
                          <MessageCircle size={12} />
                          WhatsApp Support
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <form
                onSubmit={handleSendMessage}
                className="flex flex-col gap-3"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8]"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Your Email
                    </label>
                    <input
                      type="email"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8]"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Inquiry Category
                  </label>
                  <select
                    value={contactCategory}
                    onChange={(e) => setContactCategory(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8]"
                  >
                    <option value="Orders & Payments">Orders & Payments</option>
                    <option value="Shipping & Delivery">
                      Shipping & Delivery
                    </option>
                    <option value="Replace & Refunds">Replace & Refunds</option>
                    <option value="Account">Account</option>
                    <option value="Other">Other Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Message
                  </label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Describe your question or issue in detail..."
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#6B21A8] focus:ring-1 focus:ring-[#6B21A8] resize-none"
                    required
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={isSending || !contactMessage.trim()}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#6B21A8] hover:bg-[#581c87] text-white text-xs sm:text-sm font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send
                      size={14}
                      className={isSending ? "animate-pulse" : ""}
                    />
                    {isSending ? "Sending..." : "Submit Inquiry"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}
