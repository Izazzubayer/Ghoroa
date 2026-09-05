// Source: Watermelon UI `button-3`
// https://ui.watermelon.sh/components/button — primary/secondary pair pattern
import { Button } from '@/components/ui/button';

/** Demo of Ghoroa primary (filled terracotta) + secondary (outline red). */
const Button3 = () => {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Button variant="secondary" size="cta">
        Discard
      </Button>
      <Button variant="primary" size="cta">
        Save
      </Button>
    </div>
  );
};

export default Button3;
