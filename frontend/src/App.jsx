import { useState, useRef, useEffect } from "react";
import compliments from "./components/compliments";
import Confetti from "react-confetti";
import { useTypewriter } from "./components/typewriter";
import "./index.css";
import photo1 from "./assets/photo1.jpg";
import photo2 from "./assets/photo2.jpg";
import photo3 from "./assets/photo3.jpg";
import photo4 from "./assets/photo4.jpg";
import song from "./sounds/song.mp3";
import backgroundImage from "./assets/background2.webp";

export default function App() {
  const [compliment, setCompliment] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const audioRef = useRef(null);
  const typedText = useTypewriter(compliment, 40);

  // Array of all sister photos
  const sisterPhotos = [photo1, photo2, photo3, photo4];

  const getRandomCompliment = () => {
    // Get random compliment
    const randomCompliment =
      compliments[Math.floor(Math.random() * compliments.length)];
    setCompliment(randomCompliment);

    // Get random photo index (different from current one)
    let randomPhotoIndex;
    do {
      randomPhotoIndex = Math.floor(Math.random() * sisterPhotos.length);
    } while (randomPhotoIndex === currentPhotoIndex && sisterPhotos.length > 1);

    setCurrentPhotoIndex(randomPhotoIndex);
    setShowConfetti(true);
    speakText(randomCompliment);
    setTimeout(() => setShowConfetti(false), 5000);
  };

  useEffect(() => {
    // Load voices when component mounts
    const handleVoicesChanged = () => {
      if (window.speechSynthesis.getVoices().length > 0) {
        setVoicesLoaded(true);
        window.speechSynthesis.onvoiceschanged = null; // Remove the listener
      }
    };

    // Check if voices are already available
    if (window.speechSynthesis.getVoices().length > 0) {
      setVoicesLoaded(true);
    } else {
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged;
    }

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speakText = (text) => {
    const synth = window.speechSynthesis;
    if (synth.speaking) synth.cancel();

    // Only proceed if voices are loaded
    if (!voicesLoaded) {
      console.warn("Voices not loaded yet");
      return;
    }

    const voices = synth.getVoices();
    const femaleVoice =
      voices.find(
        (voice) =>
          voice.lang.startsWith("en") &&
          (voice.name.toLowerCase().includes("female") ||
            voice.name.toLowerCase().includes("woman") ||
            voice.name.toLowerCase().includes("google us english") ||
            voice.name.toLowerCase().includes("samantha") ||
            voice.name.toLowerCase().includes("zira")),
      ) || voices[0];

    const utter = new SpeechSynthesisUtterance(text);
    utter.voice = femaleVoice;
    utter.rate = 1;
    utter.pitch = 1.1;
    utter.lang = "en-US";
    synth.speak(utter);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (audioRef.current) {
      audioRef.current.muted = !audioRef.current.muted;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;

    const tryPlay = () => {
      if (audio) {
        audio.muted = false;
        audio.play().catch(() => {
          console.warn("Autoplay blocked — waiting for user interaction");
        });
      }
    };

    tryPlay();

    const onFirstClick = () => {
      tryPlay();
      window.removeEventListener("click", onFirstClick);
    };

    window.addEventListener("click", onFirstClick);

    return () => window.removeEventListener("click", onFirstClick);
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-between text-center p-0 sm:p-6 relative overflow-y-auto overflow-x-hidden">
      {/* Background Image Layer */}
      <div className="fixed inset-0 z-0">
        <img
          src={backgroundImage}
          alt="Background"
          className="w-full h-full object-cover object-top"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {showConfetti && <Confetti />}
      <audio ref={audioRef} src={song} loop />

      {/* Top spacer keeps driver's face & cap completely clear */}
      <div className="h-[40vh] sm:h-[35vh] lg:h-0 w-full z-10 shrink-0"></div>

      {/* Main content container */}
      <div className="w-full flex flex-col lg:flex-row items-center justify-center gap-6 sm:gap-10 lg:gap-80 z-10 mb-8 lg:my-auto px-2 sm:px-4">
        {/* Photo gallery section - Full width & tall height */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full h-[65vh] lg:h-[480px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black/20">
            <img
              src={sisterPhotos[currentPhotoIndex]}
              alt="My wonderful sister"
              className="w-full h-full object-cover object-center transition-opacity duration-500"
            />
            {/* F1 Drivers Standings Badge on Photo */}
            <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-md text-white text-xs font-black px-3 py-1 rounded-full border border-white/30 flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>P1 IN MY HEART 🏆</span>
            </div>
          </div>
        </div>

        {/* Compliment section tailored for F1 Super-Fans */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl w-full h-[65vh] lg:h-[480px] flex flex-col justify-between items-center border border-pink-200 relative overflow-hidden">
            {/* Top F1 Status Bar */}
            <div className="w-full flex justify-between items-center bg-gray-900 text-white text-[10px] sm:text-xs font-mono font-bold px-3 py-1.5 rounded-xl">
              <span className="text-emerald-400">● LIVE TELEMETRY</span>
              <span className="text-yellow-400">FL: 1:12.345 🟣</span>
              <span className="text-pink-400">DRS OPEN 🟢</span>
            </div>

            {/* Main Compliment Area */}
            <div className="w-full flex-1 flex flex-col justify-center items-center my-2">
              <h1 className="text-xl sm:text-3xl lg:text-4xl font-black mb-2 text-pink-700 tracking-tight">
                Hey My F1 Bestie! 🏎️💨
              </h1>
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-pink-500 mb-3">
                Team Radio: "Copy, Loud & Clear" 📻
              </p>
              <p className="text-base sm:text-xl lg:text-2xl text-gray-800 font-medium min-h-[64px] flex items-center justify-center text-center px-2">
                {typedText || "Hit Box Box for your race radio compliment! 🏁"}
              </p>
            </div>

            {/* F1 Super-Fan Pit Dashboard */}
            <div className="w-full grid grid-cols-3 gap-2 bg-pink-50/90 p-3 rounded-2xl border border-pink-200 text-xs sm:text-sm my-2">
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase">
                  Pit Stop
                </span>
                <span className="font-extrabold text-gray-800 text-xs sm:text-sm">
                  1.8s World Rec ⚡
                </span>
              </div>
              <div className="flex flex-col items-center justify-center border-x border-pink-200 px-1">
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase">
                  Compound
                </span>
                <span className="font-extrabold text-red-600 text-xs sm:text-sm">
                  Soft C5 🔴
                </span>
              </div>
              <div className="flex flex-col items-center justify-center">
                <span className="text-gray-500 text-[9px] sm:text-[10px] font-bold uppercase">
                  Strategy
                </span>
                <span className="font-extrabold text-emerald-600 text-xs sm:text-sm">
                  P1 Box Box 🏁
                </span>
              </div>
            </div>

            {/* F1 Race Action Buttons */}
            <div className="w-full pt-2">
              <button
                onClick={getRandomCompliment}
                className="bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white font-extrabold py-3.5 sm:py-4 px-6 rounded-full transition w-full shadow-lg hover:shadow-xl text-base sm:text-lg flex items-center justify-center gap-2 uppercase tracking-wide"
              >
                <span>BOX BOX FOR COMPLIMENT</span> 🏎️💨
              </button>
              <button
                onClick={toggleMute}
                className="text-xs sm:text-sm text-gray-600 underline mt-2 hover:text-pink-600 block mx-auto font-medium"
              >
                {isMuted ? "📻 Unmute Team Radio" : "🔇 Mute Team Radio"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white/90 text-xs sm:text-sm mt-8 px-6 py-3 rounded-full bg-black/50 backdrop-blur-sm z-10 shrink-0 mb-8 font-medium">
        Made with 💙 by your F1 Besto 🏎️
      </footer>
    </div>
  );
}
