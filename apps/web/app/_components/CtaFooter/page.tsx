import { Button } from "@/components/ui/button"

const CtaFooter = () => {
  return (
    <div className="flex flex-col items-center gap-4 mt-12 mb-20">
       <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-bold tracking-tight bg-gradient-to-b from-black to-black/70 text-transparent bg-clip-text text-center leading-none pt-1 ">Sign up to get started.</h1>
       <p className="text-lg tracking-tighter text-black/70 text-center mt-5">Ready to Secure Your Interview Seat? Sign Up Now to Get Started with Our Hiring Platform</p>
       <div className="flex items-center gap-4">
          <h1 className="">Get for free</h1>
          <Button>Learn more
          <span className="material-symbols-outlined">
            arrow_right_alt
          </span>
          </Button>
       </div>
    </div>
  )
}

export default CtaFooter