// import { useState, useRef, useEffect } from "react";
// import compliments from "./components/compliments";
// import Confetti from "react-confetti";
// import { useTypewriter } from "./components/typewriter";
// import "./index.css";
// import photo from "./assets/brosis.jpg";
// import song from "./sounds/ishqhai.mp3";

// export default function App() {
//   const [compliment, setCompliment] = useState("");
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [isMuted, setIsMuted] = useState(false);

//   const audioRef = useRef(null);
//   const typedText = useTypewriter(compliment, 40);

//   const getRandomCompliment = () => {
//     const random = compliments[Math.floor(Math.random() * compliments.length)];
//     setCompliment(random);
//     setShowConfetti(true);
//     speakText(random);
//     setTimeout(() => setShowConfetti(false), 3000);
//   };

//   const speakText = (text) => {
//     const synth = window.speechSynthesis;
//     if (synth.speaking) synth.cancel();

//     // Get all available voices
//     const voices = synth.getVoices();

//     // Try to find a female English voice
//     const femaleVoice =
//       voices.find(
//         (voice) =>
//           voice.lang.startsWith("en") &&
//           (voice.name.toLowerCase().includes("female") ||
//             voice.name.toLowerCase().includes("woman") ||
//             voice.name.toLowerCase().includes("google us english") ||
//             voice.name.toLowerCase().includes("samantha") || // macOS
//             voice.name.toLowerCase().includes("zira")) // Windows
//       ) || voices[0]; // fallback

//     const utter = new SpeechSynthesisUtterance(text);
//     utter.voice = femaleVoice;
//     utter.rate = 1;
//     utter.pitch = 1.1;
//     utter.lang = "en-US";
//     synth.speak(utter);
//   };

//   const toggleMute = () => {
//     setIsMuted(!isMuted);
//     if (audioRef.current) {
//       audioRef.current.muted = !audioRef.current.muted;
//     }
//   };

//   useEffect(() => {
//     const audio = audioRef.current;

//     const tryPlay = () => {
//       if (audio) {
//         audio.muted = false;
//         audio.play().catch(() => {
//           console.warn("Autoplay blocked — waiting for user interaction");
//         });
//       }
//     };

//     // Try to play immediately
//     tryPlay();

//     // Play on first user interaction (fallback for autoplay block)
//     const onFirstClick = () => {
//       tryPlay();
//       window.removeEventListener("click", onFirstClick);
//     };

//     window.addEventListener("click", onFirstClick);

//     return () => window.removeEventListener("click", onFirstClick);
//   }, []);

//   return (
//     <div
//       className="min-h-screen bg-cover bg-center flex flex-col items-end justify-center text-center px-4"
//       style={{
//         backgroundImage: `url(${photo})`, // ✅ Use imported image here
//       }}
//     >
//       {showConfetti && <Confetti />}
//       {/* Local audio file imported via Webpack */}
//       <audio ref={audioRef} src={song} loop />
//       <div className="bg-white/80 backdrop-blur p-8 rounded-3xl shadow-lg max-w-md w-[350px]">
//         <h1 className="text-3xl font-bold mb-4 text-pink-700">Hey Sis 💖</h1>
//         <p className="text-xl mb-6 text-gray-700 min-h-[60px]">{typedText}</p>
//         <button
//           onClick={getRandomCompliment}
//           className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full transition"
//         >
//           Get Compliment 💬
//         </button>
//         <br />
//         <button
//           onClick={toggleMute}
//           className="text-sm text-gray-700 underline"
//         >
//           {isMuted ? "🔈 Unmute Music" : "🔇 Mute Music"}
//         </button>
//       </div>

//       {/* Footer */}
//       <footer className="text-white text-sm mt-6 bg-black/50 px-4 py-2 mr-14 rounded-full">
//         Made with 💙 by your brother
//       </footer>
//     </div>
//   );
// }

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
import backgroundImage from "./assets/background2.webp"; // Add your background image

export default function App() {
  const [compliment, setCompliment] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  const audioRef = useRef(null);
  const typedText = useTypewriter(compliment, 40);

  // Array of all sister photos
  const sisterPhotos = [
    photo1,
    photo2,
    photo3,
    photo4,
  ];

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
            voice.name.toLowerCase().includes("zira"))
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
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center p-4"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
      }}
    >
      {showConfetti && <Confetti />}
      <audio ref={audioRef} src={song} loop />

      {/* Main content container */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row items-center justify-center gap-8">
        {/* Photo gallery section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="relative w-full max-w-md h-96 rounded-3xl overflow-hidden shadow-xl mb-4 border-4 border-white">
            <img
              src={sisterPhotos[currentPhotoIndex]}
              alt="My wonderful sister"
              className="w-full h-full object-cover object-center transition-opacity duration-500"
            />
          </div>
        </div>

        {/* Compliment section */}
        <div className="w-full lg:w-1/2 flex flex-col items-center">
          <div className="bg-white/90 backdrop-blur p-6 md:p-8 rounded-3xl shadow-lg w-full max-w-md border border-pink-200">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 text-pink-700">
              Hey My dear F1 Best Friend 💖
            </h1>
            <p className="text-lg md:text-xl mb-6 text-gray-700 min-h-[60px]">
              {typedText}
            </p>
            <button
              onClick={getRandomCompliment}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded-full transition w-full shadow-md hover:shadow-lg"
            >
              Get Compliment 💬
            </button>
            <button
              onClick={toggleMute}
              className="text-sm text-gray-700 underline mt-4 hover:text-pink-600"
            >
              {isMuted ? "🔈 Unmute Music" : "🔇 Mute Music"}
            </button>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-gray-700 text-sm mt-8 px-4 py-2 rounded-full bg-white/80 backdrop-blur-sm">
        Made with 💙 by your F1 Best Friend
      </footer>
    </div>
  );
}
