import React from "react";
import FeatureCard from "../FeatureCard/page";
import secure from "../icons/Secure.gif";
import playback from "../icons/Playback.png";
import collaborative from "../icons/Collaborative_Coding.png";
import interviews from "../icons/Multiple_Interviews.gif";

const features = [
  {
    title: "Zero Setup Required",
    description:
      "Start coding instantly without installing  configuring environments.",
    image: collaborative,
  },
  {
    title: "Persistent Workspaces",
    description:
      "Your files and dependencies stay saved across sessions automatically.",
    image:playback,
    },
  {
    title: "Multi-Language Support",
    description:
      "Run code in multiple programming languages from a single platform.",
    image: interviews,
  },
  {
    title: "Cloud-Powered Infrastructure",
    description:
      "We handle servers, runtimes, and scaling so you can focus on building.",
    image: secure,
  },
];

const Feature = () => {
  return (
    <section>
      {/* Header */}
      <div className="mt-10 md:mt-20 max-w-[1000px] mx-auto">
        <div className="flex justify-center">
          <span
            className="
              text-sm inline-flex
              border border-black/10
              px-3 py-1
              rounded-lg
              tracking-tight
              shadow-inner
            "
          >
            Features
          </span>
        </div>

        <h2
          className="
            text-4xl sm:text-[39px] xl:text-[4.5rem]
            font-bold tracking-tight
            bg-gradient-to-b from-black to-black/70
            text-transparent bg-clip-text
            text-center mt-6
          "
          id="features"
        >
          Key features
        </h2>

        <p className="mt-6 text-black/70 tracking-tight text-center">
          Explore the Core Features of Our Project!
        </p>
      </div>

      {/* Feature Cards */}
      <div className="my-6 sm:my-10 max-w-[1200px] mx-auto">
        <div className="px-4 grid gap-8 sm:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              image={feature.image}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Feature;
