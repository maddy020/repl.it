import Image, { StaticImageData } from "next/image";
import { Button } from "@/components/ui/button";
interface FeatureProps {
  title: string;
  description: string;
  image: StaticImageData;
}

const FeatureCard = ({ title, description, image }: FeatureProps) => {
  return (
    <div className="h-full">
      <div
        className="
          h-full rounded-lg border
          shadow-inner
          hover:shadow-2xl
          transition-all duration-300
          bg-white
        "
      >
        {/* Image */}
        <div className="flex justify-center">
          <div className="w-4/5 p-8 flex items-center justify-center">
            <Image
              src={image.src}
              alt={title}
              width={400}
              height={200}
              className="max-w-full h-auto object-cover"
            />
          </div>
        </div>

        {/* Content */}
        <div className="w-full p-4">
          <h3
            className="
              text-3xl font-bold leading-10
              tracking-tight
              bg-gradient-to-b from-black to-black/70
              text-transparent bg-clip-text
              py-4
            "
          >
            {title}
          </h3>

          <p className="py-4 text-black/70 tracking-tight">
            {description}
          </p>

          <Button
            className="
              w-full py-7
              text-lg font-medium
              hover:underline
            "
          >
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FeatureCard;
