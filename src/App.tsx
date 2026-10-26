import { useEffect, useRef } from 'react';
import About from './components/About';
import Arsenal from './components/Arsenal';
import BackgroundScene from './components/BackgroundScene';
import Contact from './components/Contact';
import Falkyria from './components/Falkyria';
import Header from './components/Header';
import Hero from './components/Hero';
import Method from './components/Method';
import Projects from './components/Projects';
import { useSceneSection } from './hooks/useSceneSection';
import { startSmoothScroll } from './lib/motion';

export default function App() {
  const tail = useRef<HTMLDivElement>(null);
  // Everything after Falkyria sits in front of a dim starfield.
  useSceneSection(tail, { formation: 5, alpha: 0.5, offset: 0 });

  useEffect(() => startSmoothScroll(), []);

  return (
    <>
      <a
        href="#conteudo"
        className="fixed top-3 left-3 z-[70] -translate-y-20 rounded-full bg-ink px-4 py-2 text-sm text-bg focus:translate-y-0"
      >
        Pular para o conteúdo
      </a>
      <BackgroundScene />
      <div className="grain" aria-hidden="true" />
      <Header />
      <main id="conteudo" className="relative z-10">
        <Hero />
        <About />
        <Falkyria />
        <div ref={tail}>
          <Projects />
          <Arsenal />
          <Method />
          <Contact />
        </div>
      </main>
    </>
  );
}
