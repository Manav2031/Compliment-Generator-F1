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
    <div className="min-h-screen w-full flex flex-col items-center justify-between text-center p-3 sm:p-6 relative overflow-y-auto overflow-x-hidden">
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

      {/* Top spacer positions content right below Kimi's full face */}
      <div className="h-[45vh] sm:h-[40vh] lg:h-0 w-full z-10 shrink-0"></div>

      {/* Main content container */}
      <div className="w-full max-w-7xl flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-80 z-10 mb-8 lg:my-auto">
        {/* Photo gallery section - Perfectly square box */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-[95%] max-w-lg aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-black/20">
            <img
              src={sisterPhotos[currentPhotoIndex]}
              alt="My wonderful sister"
              className="w-full h-full object-cover object-center transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Compliment section - Perfectly square box matching photo box */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="bg-white/95 backdrop-blur-md p-6 sm:p-10 rounded-3xl shadow-2xl w-[95%] max-w-lg aspect-square flex flex-col justify-between items-center border border-pink-200">
            <div className="w-full flex-1 flex flex-col justify-center items-center">
              <h1 className="text-2xl sm:text-3xl font-bold mb-4 text-pink-700">
                Hey My dear F1 Best Friend 💖
              </h1>
              <p className="text-base sm:text-xl text-gray-700 min-h-[64px] flex items-center justify-center text-center">
                {typedText}
              </p>
            </div>

            <div className="w-full pt-4">
              <button
                onClick={getRandomCompliment}
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3.5 sm:py-4 px-6 rounded-full transition w-full shadow-lg hover:shadow-xl text-base sm:text-lg"
              >
                Get Compliment 💬
              </button>
              <button
                onClick={toggleMute}
                className="text-xs sm:text-sm text-gray-700 underline mt-3 hover:text-pink-600 block mx-auto"
              >
                {isMuted ? "🔈 Unmute Music" : "🔇 Mute Music"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-white/90 text-xs sm:text-sm mt-8 px-6 py-3 rounded-full bg-black/50 backdrop-blur-sm z-10 shrink-0 mb-8">
        Made with 💙 by your F1 Best Friend
      </footer>
    </div>
  );
}
