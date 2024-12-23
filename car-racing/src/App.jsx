import React, { useState } from "react";
import Home from "./pages/Home";
import Game from "./pages/Game";

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <>
      {isPlaying ? <Game /> : <Home onStart={() => setIsPlaying(true)} />}
    </>
  );
};

export default App;
