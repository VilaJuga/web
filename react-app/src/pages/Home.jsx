import Hero from "../components/Hero";
import Intro from "../components/Intro";
import Cards from "../components/Cards";
import Timeline from "../components/Timeline";
import Visit from "../components/Visit";
import { useSiteData } from "../context/SiteDataContext";

export default function Home() {
  const { data } = useSiteData();

  return (
    <>
      <Hero slides={data.heroSlides} />
      <main>
        <Intro intro={data.intro} gallery={data.introGallery} />
        <Cards cards={data.cards} />
        <Timeline items={data.timelineItems} />
        <Visit visit={data.visit} />
      </main>
    </>
  );
}
