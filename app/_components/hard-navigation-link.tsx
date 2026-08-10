import type { AnchorHTMLAttributes } from "react";

type HardNavigationLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
};

/**
 * Uses native document navigation for public routes. This keeps navigation
 * usable if the experimental client router cannot complete an RSC transition.
 */
export function HardNavigationLink({ href, children, ...props }: HardNavigationLinkProps) {
  return <a href={href} {...props}>{children}</a>;
}
