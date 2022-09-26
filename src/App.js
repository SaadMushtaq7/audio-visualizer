import React, { useRef, useState } from "react";
import song from "./Bikhra.mp3";
import AudioPlayer from "./component/AudioPlayer";
import "./App.css";

const App = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef();
  return (
    <div className="App">
      <audio id="audio1" ref={audioRef} src={song} />
      <AudioPlayer
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        audioRef={audioRef}
      />
    </div>
  );
};

export default App;
