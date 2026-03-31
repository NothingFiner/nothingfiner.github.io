import { iconPaths } from '../data/icons';

interface IconProps {
  name: string;
  class?: string;
  size?: number;
}

// Icons that use stroke instead of fill
const strokeIcons = ['email', 'menu', 'close'];

export function Icon({ name, class: className = '', size = 24 }: IconProps) {
  const path = iconPaths[name];
  
  if (!path) {
    console.warn(`Icon "${name}" not found`);
    return null;
  }

  const isStroke = strokeIcons.includes(name);

  return (
    <svg
      viewBox="0 0 24 24"
      class={className}
      style={{ 
        width: size, 
        height: size,
        fill: isStroke ? 'none' : 'currentColor',
        stroke: isStroke ? 'currentColor' : 'none',
        strokeWidth: isStroke ? '2' : '0',
        strokeLinecap: isStroke ? 'round' : undefined,
        strokeLinejoin: isStroke ? 'round' : undefined
      }}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d={path} />
    </svg>
  );
}
