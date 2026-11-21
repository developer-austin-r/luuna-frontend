"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  HelpCircle,
  Home,
  RefreshCw,
  ShoppingBag,
} from "lucide-react";

import styles from "./ErrorPage.module.css";

export type ErrorPageProps = {
  statusCode: 404 | 500;
  heading: string;
  description: string;
  reset?: () => void;
};

// Custom SVG Illustrations tailored to the Luuna purple & violet palette
function NotFoundIllustration() {
  return (
    <svg
      className={styles.illustrationSvg}
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="nf-purple-grad"
          x1="0"
          y1="0"
          x2="320"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#63368a" />
          <stop offset="0.5" stopColor="#825fa7" />
          <stop offset="1" stopColor="#b285dc" />
        </linearGradient>
        <linearGradient
          id="nf-soft-grad"
          x1="60"
          y1="20"
          x2="260"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#f7f0fc" />
          <stop offset="1" stopColor="#edd9fa" />
        </linearGradient>
        <filter
          id="nf-shadow"
          x="30"
          y="30"
          width="260"
          height="170"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow
            dx="0"
            dy="8"
            stdDeviation="12"
            floodColor="#825fa7"
            floodOpacity="0.22"
          />
        </filter>
      </defs>

      {/* Floating Sparkles & Cosmic Stars */}
      <circle cx="50" cy="40" r="3.5" fill="#825fa7" opacity="0.65" />
      <circle cx="280" cy="48" r="4" fill="#a472c9" opacity="0.75" />
      <circle cx="270" cy="180" r="3" fill="#825fa7" opacity="0.55" />
      <circle cx="42" cy="160" r="2.5" fill="#63368a" opacity="0.45" />
      <path
        d="M 65 85 L 68 93 L 76 96 L 68 99 L 65 107 L 62 99 L 54 96 L 62 93 Z"
        fill="#b285dc"
        opacity="0.8"
      />
      <path
        d="M 245 120 L 247 126 L 253 128 L 247 130 L 245 136 L 243 130 L 237 128 L 243 126 Z"
        fill="#825fa7"
        opacity="0.85"
      />

      {/* Ground Pedestal Shadow in soft lavender */}
      <ellipse
        cx="160"
        cy="195"
        rx="100"
        ry="12"
        fill="#debfe8"
        opacity="0.6"
      />
      <ellipse cx="160" cy="195" rx="70" ry="7" fill="#cca3dc" opacity="0.45" />

      {/* Cosmic Box / Mystery Parcel */}
      <g filter="url(#nf-shadow)">
        <path
          d="M 105 105 L 160 78 L 215 105 L 215 155 L 160 182 L 105 155 Z"
          fill="url(#nf-soft-grad)"
          stroke="#cca3dc"
          strokeWidth="2"
        />
        <path
          d="M 160 78 L 160 182"
          stroke="#a472c9"
          strokeWidth="2"
          strokeDasharray="4 3"
        />
        <path
          d="M 105 105 L 160 132 L 215 105"
          fill="none"
          stroke="#cca3dc"
          strokeWidth="2"
        />
      </g>

      {/* Floating Magnifying Glass looking for page */}
      <g transform="translate(140, 60)">
        <circle
          cx="35"
          cy="35"
          r="28"
          fill="#ffffff"
          stroke="url(#nf-purple-grad)"
          strokeWidth="5.5"
        />
        <circle cx="35" cy="35" r="21" fill="#fcf7ff" opacity="0.85" />
        <text
          x="35"
          y="42"
          textAnchor="middle"
          fontSize="22"
          fontWeight="bold"
          fill="#63368a"
          fontFamily="system-ui, sans-serif"
        >
          ?
        </text>
        <path
          d="M 55 55 L 78 78"
          stroke="url(#nf-purple-grad)"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <path
          d="M 60 60 L 76 76"
          stroke="#ffffff"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.6"
        />
      </g>
    </svg>
  );
}

function ServerErrorIllustration() {
  return (
    <svg
      className={styles.illustrationSvg}
      viewBox="0 0 320 220"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="se-purple-grad"
          x1="0"
          y1="0"
          x2="320"
          y2="220"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#63368a" />
          <stop offset="0.6" stopColor="#825fa7" />
          <stop offset="1" stopColor="#d946ef" />
        </linearGradient>
        <linearGradient
          id="se-server-grad"
          x1="90"
          y1="50"
          x2="230"
          y2="180"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#ffffff" />
          <stop offset="0.6" stopColor="#fbf7ff" />
          <stop offset="1" stopColor="#ebd6f7" />
        </linearGradient>
        <filter
          id="se-shadow"
          x="40"
          y="30"
          width="240"
          height="175"
          filterUnits="userSpaceOnUse"
        >
          <feDropShadow
            dx="0"
            dy="10"
            stdDeviation="14"
            floodColor="#825fa7"
            floodOpacity="0.25"
          />
        </filter>
      </defs>

      {/* Decorative pulse dots and sparks */}
      <circle cx="55" cy="45" r="3" fill="#d946ef" opacity="0.65" />
      <circle cx="265" cy="65" r="4" fill="#a472c9" opacity="0.75" />
      <circle cx="45" cy="140" r="3" fill="#825fa7" opacity="0.5" />
      <path
        d="M 270 140 L 274 148 L 282 151 L 274 154 L 270 162 L 266 154 L 258 151 L 266 148 Z"
        fill="#e879f9"
        opacity="0.8"
      />

      {/* Ground Pedestal Shadow */}
      <ellipse
        cx="160"
        cy="196"
        rx="95"
        ry="11"
        fill="#debfe8"
        opacity="0.65"
      />

      {/* Server Stack in Luuna Theme */}
      <g filter="url(#se-shadow)">
        {/* Tier 1 (Bottom) */}
        <rect
          x="95"
          y="142"
          width="130"
          height="34"
          rx="8"
          fill="url(#se-server-grad)"
          stroke="#cca3dc"
          strokeWidth="2"
        />
        <circle cx="115" cy="159" r="4" fill="#10b981" />
        <circle cx="127" cy="159" r="4" fill="#825fa7" />
        <rect x="145" y="156" width="62" height="6" rx="3" fill="#debfe8" />

        {/* Tier 2 (Middle) */}
        <rect
          x="95"
          y="98"
          width="130"
          height="34"
          rx="8"
          fill="url(#se-server-grad)"
          stroke="#cca3dc"
          strokeWidth="2"
        />
        <circle cx="115" cy="115" r="4" fill="#f59e0b" />
        <circle cx="127" cy="115" r="4" fill="#825fa7" />
        <rect x="145" y="112" width="62" height="6" rx="3" fill="#debfe8" />

        {/* Tier 3 (Top - Disrupted/Alert) */}
        <rect
          x="95"
          y="54"
          width="130"
          height="34"
          rx="8"
          fill="url(#se-server-grad)"
          stroke="#d946ef"
          strokeWidth="2"
        />
        <circle cx="115" cy="71" r="4" fill="#d946ef">
          <animate
            attributeName="opacity"
            values="1;0.3;1"
            dur="1.8s"
            repeatCount="indefinite"
          />
        </circle>
        <circle cx="127" cy="71" r="4" fill="#825fa7" />
        <rect x="145" y="68" width="62" height="6" rx="3" fill="#f5d0fe" />
      </g>

      {/* Floating repair tool badge */}
      <g transform="translate(195, 36)">
        <circle
          cx="26"
          cy="26"
          r="22"
          fill="#ffffff"
          stroke="url(#se-purple-grad)"
          strokeWidth="3"
        />
        <path
          d="M 21 17 C 23 15 26 15 28 17 L 31 20 C 33 22 33 25 31 27 L 23 35 C 22 36 20 36 19 35 L 17 33 C 16 32 16 30 17 29 Z"
          fill="#825fa7"
        />
        <circle cx="31" cy="21" r="2.5" fill="#ffffff" />
      </g>
    </svg>
  );
}

export default function ErrorPage({
  statusCode,
  heading,
  description,
  reset,
}: ErrorPageProps) {
  const router = useRouter();

  const handleGoBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else {
      router.push("/");
    }
  };

  const isNotFound = statusCode === 404;

  return (
    <main className={styles.errorPageContainer} role="main">
      <div className={styles.ambientGlowTop} aria-hidden="true" />
      <div className={styles.ambientGlowBottom} aria-hidden="true" />

      {/* Content displayed directly on the full-screen background with no enclosing card/box */}
      <div className={styles.contentWrapper} aria-labelledby="error-heading">
        {/* Existing Luuna Logo */}
        <Link href="/" className={styles.logoLink} aria-label="Luuna Home">
          <Image
            src="/images/luuna.png"
            alt="Luuna"
            width={2122}
            height={741}
            priority
            className={styles.logoImage}
          />
        </Link>

        {/* Friendly Vector Illustration directly on the background */}
        <div className={styles.illustrationWrapper}>
          {isNotFound ? <NotFoundIllustration /> : <ServerErrorIllustration />}
        </div>

        {/* Prominent Status Code in Luuna Purple Gradient */}
        <span
          className={styles.statusCode}
          aria-label={`Error code ${statusCode}`}
        >
          {statusCode}
        </span>

        {/* Heading & Description */}
        <h1 id="error-heading" className={styles.heading}>
          {heading}
        </h1>
        <p className={styles.description}>{description}</p>

        {/* Responsive Interactive Action Buttons */}
        <div className={styles.actions}>
          {isNotFound ? (
            <>
              <button
                type="button"
                onClick={handleGoBack}
                className={styles.secondaryButton}
                aria-label="Go back to the previous page"
              >
                <ArrowLeft size={18} aria-hidden="true" />
                <span>Go Back</span>
              </button>
              <Link href="/" className={styles.primaryButton}>
                <Home size={18} aria-hidden="true" />
                <span>Go to Home</span>
              </Link>
            </>
          ) : (
            <>
              {reset && (
                <button
                  type="button"
                  onClick={() => reset()}
                  className={styles.primaryButton}
                  aria-label="Try running the action again"
                >
                  <RefreshCw size={18} aria-hidden="true" />
                  <span>Try Again</span>
                </button>
              )}
              <Link href="/" className={styles.secondaryButton}>
                <Home size={18} aria-hidden="true" />
                <span>Go to Home</span>
              </Link>
            </>
          )}
        </div>

        {/* Quick Footer Links */}
        <nav className={styles.footerLinks} aria-label="Quick links">
          <Link href="/categories/anime">Anime Figures</Link>
          <span>•</span>
          <Link href="/cart">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <ShoppingBag size={14} aria-hidden="true" /> Cart
            </span>
          </Link>
          <span>•</span>
          <Link href="/help-support">
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              <HelpCircle size={14} aria-hidden="true" /> Help &amp; Support
            </span>
          </Link>
        </nav>
      </div>
    </main>
  );
}
