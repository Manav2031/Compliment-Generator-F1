import { useState, useEffect } from "react";

export const useTypewriter = (text, speed = 40) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplayedText("");
      return;
    }

    setDisplayedText("");
    let i = 0;
    let currentText = "";

    const typingEffect = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setDisplayedText(currentText);
        i++;
      } else {
        clearInterval(typingEffect);
      }
    }, speed);

    return () => clearInterval(typingEffect);
  }, [text, speed]);

  return displayedText;
};
