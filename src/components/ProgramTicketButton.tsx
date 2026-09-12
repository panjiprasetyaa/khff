"use client";

import { useState } from "react";
import { Ticket } from "lucide-react";
import ProgramBookingModal from "@/components/ProgramBookingModal";

interface ProgramTicketButtonProps {
  eventId: string;
  className?: string;
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "pill" | "outline";
}

export default function ProgramTicketButton({
  eventId,
  className = "",
  label = "Registrasi di Sini",
  size = "md",
  variant = "primary",
}: ProgramTicketButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-mono font-black uppercase tracking-wider transition-all duration-300 cursor-pointer shadow-md";

  const sizeStyles = {
    sm: "text-[11px] py-2 px-3.5 rounded-xl",
    md: "text-xs py-2.5 px-5 rounded-2xl",
    lg: "text-xs sm:text-sm py-3.5 px-7 rounded-full",
  }[size];

  const variantStyles = {
    primary:
      "bg-khff-yellow text-khff-navy hover:bg-white hover:scale-105 shadow-[0_4px_20px_rgba(236,172,45,0.3)]",
    secondary:
      "bg-khff-pink text-white hover:bg-white hover:text-khff-navy hover:scale-105",
    pill:
      "bg-white/10 hover:bg-khff-yellow hover:text-khff-navy text-khff-cream border border-white/20 rounded-full",
    outline:
      "bg-transparent border-2 border-khff-yellow text-khff-yellow hover:bg-khff-yellow hover:text-khff-navy",
  }[variant];

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsOpen(true);
        }}
        className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      >
        <Ticket size={size === "sm" ? 13 : size === "lg" ? 17 : 15} />
        <span>{label}</span>
      </button>

      {isOpen && (
        <ProgramBookingModal
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          initialEventId={eventId}
        />
      )}
    </>
  );
}
