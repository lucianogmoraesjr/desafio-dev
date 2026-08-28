import { SVGProps } from "react";

export function TransactionsIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="44"
      height="44"
      fill="none"
      viewBox="0 0 44 44"
      {...props}
    >
      <rect width="42" height="42" x="1" y="1" fill="#EDF2FF" rx="21" />
      <rect
        width="42"
        height="42"
        x="1"
        y="1"
        stroke="#fff"
        rx="21"
        strokeWidth="2"
      />
      <g
        stroke="#364FC7"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M31 24.24h-3.548a2.359 2.359 0 0 1 0-4.717H31m-3.714 2.306h-.004" />
        <path d="M14.23 19.887v-1.03a4.6 4.6 0 0 1 4.599-4.6h7.573a4.6 4.6 0 0 1 4.598 4.6v6.288a4.6 4.6 0 0 1-4.598 4.598h-2.316m-4.723-.107v-5.554m1.734 3.883-1.733 1.672-1.733-1.672m-2.897-3.883v5.554M13 25.754l1.733-1.672 1.733 1.672" />
      </g>
    </svg>
  );
}
