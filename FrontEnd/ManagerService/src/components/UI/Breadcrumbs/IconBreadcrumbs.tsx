import React from "react";

export const AdminIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    aria-hidden="false"
    fill="none"
    height="1em"
    viewBox="0 0 24 24"
    width="1em"
    {...props}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M4 20c0-4 8-4 8-4s8 0 8 4"
      stroke="currentColor"
      strokeLinecap="round"
      strokeWidth="1.5"
    />
    <circle cx="18" cy="6" fill="currentColor" r="2" />
  </svg>
);
