import React from "react";

/**
 * Small inline SVG icon set used across the chat UI.
 * All icons inherit currentColor by default.
 */

// PUBLIC_INTERFACE
export function PlusIcon({ size = 16, className = "" }) {
  /** Circular plus icon for actions (add/new). */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function SearchIcon({ size = 16, className = "" }) {
  /** Magnifier icon for search inputs. */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
      <path d="M20 20l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function SendIcon({ size = 16, className = "" }) {
  /** Paper plane icon for the send button. */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.4 20.6l17.7-7.6a1 1 0 000-1.8L3.4 3.6a1 1 0 00-1.3 1.3L5.2 11l-3 6a1 1 0 001.2 1.4zM6.9 12l-3-7 13.7 5.9L6.9 12z" />
    </svg>
  );
}

// PUBLIC_INTERFACE
export function ChevronRightIcon({ size = 14, className = "" }) {
  /** Chevron right icon used in outline chips. */
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M10 7l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
