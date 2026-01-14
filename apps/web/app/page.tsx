
import Testimonials from "./_components/Testimonials/page";
import Docshowcase from "./_components/DocsShowCase/page";
import CtaFooter from "./_components/CtaFooter/page";
import { Footer } from "./_components/Footer/page";
import Feature from "./_components/Features/page";
import LogoTicker from "./_components/LogoTicker/page";
export default async function Home() {
  return (
    <div>
       <LogoTicker/>
       <Feature/>
       <Docshowcase/>
       <Testimonials/>
       <CtaFooter/>
       <Footer/>
    </div>
  )
}
