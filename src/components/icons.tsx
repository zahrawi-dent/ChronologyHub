import { type JSX, splitProps } from 'solid-js';

interface IconProps extends JSX.SvgSVGAttributes<SVGSVGElement> {
  class?: string;
  size?: number | string;
}

export const Calendar = (props: IconProps) => {
  const [local, others] = splitProps(props, ['class', 'size']);
  const size = local.size || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={local.class}
      {...others}
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
};

export const Clock = (props: IconProps) => {
  const [local, others] = splitProps(props, ['class', 'size']);
  const size = local.size || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={local.class}
      {...others}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12,6 12,12 16,14" />
    </svg>
  );
};

export const Info = (props: IconProps) => {
  const [local, others] = splitProps(props, ['class', 'size']);
  const size = local.size || 24;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class={local.class}
      {...others}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
};
