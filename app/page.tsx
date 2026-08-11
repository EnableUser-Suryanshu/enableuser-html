import Hero from '@/components/Hero';
import Ecosystem from '@/components/Ecosystem';
import Steps from '@/components/Steps';
import Partner from '@/components/Partner';
import Stats from '@/components/Stats';
import BrandMarquee from '@/components/BrandMarquee';
import News from '@/components/News';
import Banking from '@/components/Banking';
import Faq from '@/components/Faq';
import Help from '@/components/Help';

export default function Page() {
  return (
    <main id="main">
      <Hero />
      <Ecosystem />
      <Steps />
      <Partner />
      <Stats />
      <BrandMarquee />
      <News />
      <Banking />
      <Faq />
      <Help />
    </main>
  );
}
