"use client";

import * as React from "react";

type ImageProps = React.ImgHTMLAttributes<HTMLImageElement> & {
  src: string;
  alt: string;
  width?: number;
  height?: number;
};

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  ({ src, alt, width, height, ...rest }, ref) => (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      ref={ref}
      {...rest}
    />
  )
);
Image.displayName = "Image";

type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ href, children, ...rest }, ref) => (
    <a href={href} ref={ref} {...rest}>
      {children}
    </a>
  )
);
Link.displayName = "Link";

export function Footer() {
  return (
    <footer className="border-t border-primary/10">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-4 text-center">
          {/* Logo */}
          <Link href="/">
            <Image
              src="/Het-Energielabel-Loket-logo.png"
              alt="Het Energielabel Loket Logo"
              width={140}
              height={40}
              className="w-20"
            />
          </Link>

          {/* <div className="text-foreground/90">
            <p>Werkgebied: heel Nederland</p>
          </div> */}

          {/* Terms and Conditions Link */}
          <div className="text-center py-4">
            <Link
              href="/algemene-voorwaarden"
              className="inline-block text-xl font-bold text-primary hover:text-primary/90 transition-colors border-2 border-primary/30 hover:border-primary/60 px-6 py-3 rounded-lg bg-primary/5 hover:bg-primary/10"
            >
              Algemene Voorwaarden
            </Link>
          </div>

          {/* Company Info */}
          <div className="text-foreground/90 space-y-2">
            <p>© 2025 Het Energielabel Loket. Alle rechten voorbehouden</p>
            <p>cid:15C8FCFB-9920-484A-B0C3-2DD45EA28C65</p>
          </div>
          <div className="text-foreground/90">
            <p>
              Developed by
              <Link
                className="hover:underline hover:text-primary px-1"
                href="https://wasif-khan.netlify.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Wasif Ali
              </Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 