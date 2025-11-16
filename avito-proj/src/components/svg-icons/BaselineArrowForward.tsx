import type { JSX, SVGProps } from "react";

export default function BaselineArrowForward(
  { className }: SVGProps<SVGSVGElement>
): JSX.Element {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      className={className}
    >
      <path
        fill="currentColor"
        d="m12 4l-1.41 1.41L16.17 11H4v2h12.17l-5.58 5.59L12 20l8-8z"
      />
    </svg>
  );
}
