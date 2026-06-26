import * as React from "react";
import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NavLink {
  label: string;
  href: string;
}

interface AnimatedHeroProps {
  backgroundImageUrl: string;
  logo: React.ReactNode;
  navLinks: NavLink[];
  topRightAction?: React.ReactNode;
  title: string;
  description: string;
  ctaButton: {
    text: string;
    onClick: () => void;
  };
  secondaryCta?: {
    text: string;
    onClick: () => void;
  };
  className?: string;
}

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const AnimatedHero = ({
  backgroundImageUrl,
  logo,
  navLinks,
  topRightAction,
  title,
  description,
  ctaButton,
  secondaryCta,
  className,
}: AnimatedHeroProps) => {
  const glassButtonClassName =
    "bg-white/10 backdrop-blur-sm border border-white/20 text-primary-foreground hover:bg-white/20 transition-colors";

  return (
    <section
      className={cn(
        "relative flex min-h-[92vh] w-full flex-col items-center justify-center overflow-hidden bg-background",
        className,
      )}
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImageUrl})` }}
      >
        <div className="absolute inset-0 bg-slate-950/70" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-background to-transparent" />
      </div>

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="absolute top-0 z-20 flex h-20 w-full items-center justify-between px-5 text-white md:px-12"
      >
        <div className="flex items-center gap-2">{logo}</div>
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-primary-foreground/80 transition-colors hover:text-primary-foreground"
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="hidden md:block">{topRightAction}</div>
      </motion.header>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex w-full max-w-6xl flex-col items-start justify-center px-5 pt-16 text-left text-white md:px-12"
      >
        <motion.p
          variants={itemVariants}
          className="mb-5 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-medium text-primary-foreground/90 backdrop-blur"
        >
          Employee Management System v2
        </motion.p>
        <motion.h1
          variants={itemVariants}
          className="max-w-4xl text-4xl font-bold tracking-normal text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.p variants={itemVariants} className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/82">
          {description}
        </motion.p>
        <motion.div variants={itemVariants} className="mt-10 flex flex-wrap items-center gap-4">
          <Button onClick={ctaButton.onClick} size="lg" className={glassButtonClassName}>
            {ctaButton.text}
          </Button>
          {secondaryCta && (
            <Button onClick={secondaryCta.onClick} size="lg" className={glassButtonClassName}>
              {secondaryCta.text}
            </Button>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
};
