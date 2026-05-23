import type { SVGProps } from "react";

export function LogoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 256" fill="currentColor" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M128.005 191.173C128.448 156.208 156.93 128 192 128V64H128C128 99.346 99.346 128 64 128V192H128V191.173ZM192 256H64C28.654 256 0 227.346 0 192V64H64V0H192C227.346 0 256 28.654 256 64V192H192V256Z" />
    </svg>
  );
}
