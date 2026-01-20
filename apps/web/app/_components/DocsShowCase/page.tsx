import Image from "next/image";

const Docshowcase = () => {
  return (
    <div className="bg-black text-white pl-8 pt-8 pb-8 mt-40 mb-20 md:mx-40 md:rounded-xl md:pb-0 md:overflow-hidden" id="api">
      <div className="border border-white/25 rounded-md shadow-[inset_0_0_5px_rgba(255,255,255,0.55)] h-10 w-22 flex items-center justify-center mb-4">
        <div className="text-sm text-white/70">Repl.it</div>
      </div>
      <div className="flex flex-col md:flex-row md:gap-[15rem] md:pt-4">
        <div className="flex flex-col gap-4 md:text-base">
          <h1 className="text-4xl font-bold leading-10 tracking-tight">Ready for developers</h1>
          <p className="text-sm md:text-lg tracking-tight text-white/70 mt-5 mr-4">
            No downloads. No configuration. Your development environment is ready in seconds.
          </p>
          <a
            className="text-sm text-black w-30 p-2 rounded flex items-center gap-2 bg-white mb-4"
            href="https://github.com/maddy020/repl.it"
          >
            Read Docs
            <span className="material-symbols-outlined">arrow_right_alt</span>
          </a>
        </div>
        <div className="hidden lg:flex items-end justify-end pl-3 pt-3 pb-3 rounded-lg rounded-tr-none bg-[#18181b] backdrop-blur shadow-[inset_0_4px_6px_-1px_rgba(255,255,255,0.6)]">
          <Image
            src="https://res.cloudinary.com/dtc9ysbnn/image/upload/v1723236913/api_uab9ko.png"
            alt="api image"
            width={650}
            height={300}
            className="overflow-hidden items-end "
          />
        </div>
      </div>
    </div>
  );
};

export default Docshowcase;