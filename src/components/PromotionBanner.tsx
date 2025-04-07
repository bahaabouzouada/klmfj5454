
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface PromotionBannerProps {
  title: string;
  description: string;
  actionText: string;
  actionLink: string;
  secondaryActionText?: string;
  secondaryActionLink?: string;
  image?: string;
}

const PromotionBanner = ({
  title,
  description,
  actionText,
  actionLink,
  secondaryActionText,
  secondaryActionLink,
  image,
}: PromotionBannerProps) => {
  return (
    <div className="bg-gradient-to-l from-teal-600 to-teal-500 rounded-lg overflow-hidden">
      <div className="flex flex-col md:flex-row">
        <div className="p-6 md:p-8 md:w-1/2">
          <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{title}</h3>
          <p className="text-teal-50 mb-6">{description}</p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Button asChild className="bg-white text-teal-600 hover:bg-teal-50">
              <Link to={actionLink}>{actionText}</Link>
            </Button>
            {secondaryActionText && secondaryActionLink && (
              <Button asChild variant="outline" className="border-white text-white hover:bg-teal-700 hover:text-white">
                <Link to={secondaryActionLink}>{secondaryActionText}</Link>
              </Button>
            )}
          </div>
        </div>
        {image && (
          <div className="md:w-1/2 relative h-48 md:h-auto">
            <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover" />
          </div>
        )}
      </div>
    </div>
  );
};

export default PromotionBanner;
