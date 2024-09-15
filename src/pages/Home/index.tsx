import { HomeContent } from './components/Home';
import { HomeProvider } from './useHome';


export function Home() {



  return (
    <HomeProvider>
      <HomeContent />
    </HomeProvider>
  );
}


