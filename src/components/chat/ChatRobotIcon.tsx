"use client";

import styles from "./n8n-chatbot.module.css";

/** Robot SVG decorativo con animaciones CSS (antena, ojos, brazos, flotación). */
export function ChatRobotIcon({
  className,
  title,
  size = 40,
}: {
  className?: string;
  title?: string;
  size?: number;
}) {
  return (
    <span
      className={`${styles.robotWrap} ${className ?? ""}`}
      style={{ width: size, height: size }}
    >
      <svg
        className={styles.robotSvg}
        viewBox="0 0 64 64"
        role="img"
        aria-hidden={title ? undefined : true}
        aria-label={title}
      >
        {title ? <title>{title}</title> : null}
        {/* cuerpo */}
        <rect
          x="18"
          y="22"
          width="28"
          height="26"
          rx="6"
          fill="#1e3a5f"
          stroke="#60a5fa"
          strokeWidth="1.5"
        />
        {/* cabeza */}
        <rect
          x="20"
          y="10"
          width="24"
          height="16"
          rx="5"
          fill="#2563eb"
          stroke="#93c5fd"
          strokeWidth="1.2"
        />
        {/* antena */}
        <g className={styles.antenna}>
          <line
            x1="32"
            y1="10"
            x2="32"
            y2="4"
            stroke="#93c5fd"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="32" cy="3" r="2.5" fill="#fbbf24" />
        </g>
        {/* ojos */}
        <ellipse className={styles.eye} cx="26" cy="17" rx="2.8" ry="3.2" fill="#e0f2fe" />
        <ellipse className={styles.eye} cx="38" cy="17" rx="2.8" ry="3.2" fill="#e0f2fe" />
        {/* boca */}
        <path
          d="M 27 21 Q 32 24 37 21"
          fill="none"
          stroke="#bfdbfe"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        {/* brazos */}
        <g className={styles.armL}>
          <path
            d="M 18 28 L 12 34"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="11" cy="35" r="3" fill="#3b82f6" />
        </g>
        <g className={styles.armR}>
          <path
            d="M 46 28 L 52 34"
            stroke="#60a5fa"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          <circle cx="53" cy="35" r="3" fill="#3b82f6" />
        </g>
        {/* piernas */}
        <rect x="24" y="46" width="6" height="10" rx="2" fill="#1e40af" />
        <rect x="34" y="46" width="6" height="10" rx="2" fill="#1e40af" />
        {/* pecho */}
        <circle cx="32" cy="34" r="4" fill="#38bdf8" opacity="0.6" />
      </svg>
    </span>
  );
}
