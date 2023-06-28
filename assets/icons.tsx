interface CheckProps {
  // eslint-disable-next-line react/require-default-props
  fill?: string;
}

const Check = ({ fill }: CheckProps) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="0 96 960 960" fill={fill ?? 'white'}>
    <path d="m424 760 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197 859q-54-54-85.5-127T80 576q0-83 31.5-156T197 293q54-54 127-85.5T480 176q83 0 156 31.5T763 293q54 54 85.5 127T880 576q0 83-31.5 156T763 859q-54 54-127 85.5T480 976Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
  </svg>
);

const ArrowDown = () => (
  <svg width="47" height="51" viewBox="0 0 47 51" fill="none" xmlns="http://www.w3.org/2000/svg">
    <mask id="path-1-inside-1_31_19691" fill="white">
      <path d="M0 50.9072H47V0.907227H0V50.9072Z" />
    </mask>
    <path d="M0 50.9072H47V0.907227H0V50.9072Z" fill="white" />
    <path d="M32 25.8174L23.5 34.3174L15 25.8174" stroke="black" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <line x1="23.5156" y1="32.7979" x2="23.5156" y2="12.6615" stroke="black" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M47 1.90723H0V-0.0927734H47V1.90723Z" fill="#979797" mask="url(#path-1-inside-1_31_19691)" />
  </svg>
);

const MySVGComponent = () => {
  <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100">
    <circle cx="50" cy="50" r="40" stroke="black" strokeWidth="3" fill="red" />
  </svg>;
};

export { Check, ArrowDown, MySVGComponent };
