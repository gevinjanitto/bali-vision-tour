import React from 'react';
import * as Icons from 'lucide-react';

// Renders a lucide icon by its string name (used by mock data)
const Icon = ({ name, className = 'w-5 h-5', ...rest }) => {
  const Cmp = Icons[name] || Icons.Sparkles;
  return <Cmp className={className} {...rest} />;
};

export default Icon;
