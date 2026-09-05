// Source: Watermelon UI `button-4`
'use client';

import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Button4 = () => {
  return (
    <Button className=" group inline-flex items-center gap-2 rounded-lg">
      Explore More
      <ArrowRight className="size-4 transition-transform duration-200 ease-out group-hover:translate-x-1 group-hover:scale-110" />
    </Button>
  );
};

export default Button4;
