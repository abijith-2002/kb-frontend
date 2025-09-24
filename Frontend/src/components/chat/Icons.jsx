import React from "react";

/**
 * PUBLIC_INTERFACE
 * Icons
 * Minimal inline SVG icon set used across the chat UI (size ~16-20px).
 */
export const PlusIcon = ({ size = 16, className = "", stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const SearchIcon = ({ size = 16, className = "", stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"></circle>
    <path d="M21 21l-4.3-4.3"></path>
  </svg>
);

export const PaperclipIcon = ({ size = 18, className = "", stroke = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21.44 11.05l-9.19 9.19a5.5 5.5 0 01-7.78-7.78l9.19-9.19a3.5 3.5 0 015 5l-9.2 9.2a1.5 1.5 0 01-2.12-2.12l8.49-8.49" />
  </svg>
);

export const SendIcon = ({ size = 18, className = "", stroke = "#0E1613" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden="true" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 2L11 13" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" />
  </svg>
);
