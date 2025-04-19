import React from 'react';
import { Radio } from 'lucide-react';

interface LogoProps {
  className?: string;
}

const Logo: React.FC<LogoProps> = ({ className = "h-6 w-6" }) => {
  return <Radio className={className} />;
};

export default Logo;