// import logo from './logo.svg';
import './styles/style.css';
import GlassContainer from './components/GlassContainer';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';


function App() {
  return (
    <div>
      {/* <GlassContainer/> */}
      <Navbar/>
       <main style={{ paddingTop: '4rem' }}>
        <Hero />
      </main>
      <Features/>
    </div>
  );
}


export default App;
