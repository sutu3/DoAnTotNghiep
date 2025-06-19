import * as React from "react";

import { cn } from "@/lib/utils"; // Assume you have this utility

// Using ForwardRef for better integration with forms/libraries
const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
    ({ className, type, ...props }, ref) => {
        return (
            <input

                type={type}
                ref={ref} // Use the forwarded ref
                data-slot="input" // Keep if needed for specific data attributes
                className={cn(
                    // --- Base Styles ---
                    // Layout & Sizing:
                    "flex h-10 w-full rounded-md border", // Use h-10 (40px) and py-2 for better vertical text alignment
                    "bg-background px-3 py-2 text-sm text-foreground", // Use semantic colors, sm text size is common for inputs, adjust if needed
                    "shadow-sm", // A subtle shadow (can remove if you prefer a flat design)
                    "transition-colors file:transition-colors", // Smooth transitions for background, border, shadow (and file part)

                    // Appearance
                    "border-input", // Standard border color
                    "placeholder:text-muted-foreground", // Placeholder color

                    // Text Selection:
                    "selection:bg-primary selection:text-primary-foreground", // Nicer text selection style

                    // Outline Reset (required when using custom focus rings)
                    "outline-none",

                    // --- State Styles ---
                    // Focus State (using focus-visible for accessibility)
                    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", // Add offset for better ring visibility

                    // Disabled State:
                    "disabled:cursor-not-allowed disabled:opacity-50",
                    // Note: pointer-events-none is often implied by disabled, or you can add it if needed: disabled:pointer-events-none

                    // Error/Invalid State (using aria-invalid="true")
                    // Applies border and potential background change
                    "aria-invalid:border-destructive",
                    // Applies ring color on focus for invalid state
                    "aria-invalid:focus-visible:ring-destructive/20 dark:aria-invalid:focus-visible:ring-destructive/40", // Use specific focus invalid ring

                    // --- Specific styles for type="file" ---
                    "file:mr-4 file:inline-flex file:h-7 file:items-center file:justify-center", // Basic file input button alignment/sizing
                    "file:rounded-md file:border file:border-input file:bg-transparent", // File button border/bg
                    "file:px-3 file:py-1 file:text-sm file:font-medium file:text-foreground", // File button text/padding
                    "file:shadow-sm", // Optional shadow for the file button
                    "file:cursor-pointer", // Indicate file button is clickable
                    "file:hover:bg-accent file:hover:text-accent-foreground", // Hover state for file button

                    // --- Override with Custom Classes ---
                    className // Allow overriding base styles with provided className
                )}
                {...props}
            />
        );
    }
);

Input.displayName = "Input";

export { Input };