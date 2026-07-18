type IconProps = {
  className?: string;
};

export function ArrowUpIcon({ className }: IconProps) {
  return (
    <svg className={className} width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path d="M7 12.5V1.5M7 1.5L1.5 7M7 1.5L12.5 7" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowRightIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
      <path d="M0.5 6H15M15 6L10 1M15 6L10 11" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

export function CloseIcon({ className }: IconProps) {
  return (
    <svg className={className} width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M2 2L18 18M18 2L2 18" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}

export function PlusIcon({ className }: IconProps) {
  return (
    <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 1V15M1 8H15" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" />
    </svg>
  );
}
