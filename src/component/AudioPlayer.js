import React, { useCallback, useEffect, useRef } from "react";
import { BsFillPlayCircleFill, BsPauseCircleFill } from "react-icons/bs";
import "./styles.css";

const AudioPlayer = ({ isPlaying, setIsPlaying, audioRef }) => {
  const canvasRef = useRef();
  const context = useRef();
  const audioContext = useRef();
  const source = useRef();
  const analyser = useRef();
  const bufferLength = useRef();
  const frequencyArray = useRef([]);
  const rafId = useRef();

  const canvasPrimaryColor = "#838383";
  const canvasSecondaryColor = "#4d4d4d";
  const stroke = "#4d4d4d";

  const playPauseToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
      cancelAnimationFrame(rafId.current);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
      requestAnimationFrame(animate);
    }
  };

  const animate = useCallback(() => {
    rafId.current = requestAnimationFrame(animate);

    const CENTERX = canvasRef.current.width / 2;
    const CENTERY = canvasRef.current.height / 2;

    const WIDTH = 250;
    const HEIGHT = 250;

    analyser.current.getByteFrequencyData(frequencyArray.current);
    context.current.clearRect(0, 0, WIDTH, HEIGHT);

    let gradient = context.current.createLinearGradient(
      0,
      110,
      90,
      30,
      100,
      100,
      70
    );
    gradient.addColorStop(0.1, canvasPrimaryColor);
    gradient.addColorStop(0.4, canvasSecondaryColor);
    gradient.addColorStop(0.7, canvasSecondaryColor);
    gradient.addColorStop(0.9, canvasPrimaryColor);
    gradient.addColorStop(1, canvasPrimaryColor);

    for (let i = 0; i < bufferLength.current; i++) {
      let radius = frequencyArray.current[i] / 2;
      if (radius < 20) radius = 20;
      if (radius > 100) radius = 100;
      context.current.beginPath();
      context.current.arc(CENTERX, CENTERY, radius, 0, 2 * Math.PI, false);
      context.current.fillStyle = gradient;
      context.current.fill();
      context.current.lineWidth = 10;
      context.current.strokeStyle = stroke;
      context.current.stroke();
    }
  }, []);

  const drawCircle = useCallback(() => {
    const canvasCtx = context.current;

    const WIDTH = 250;
    const HEIGHT = 250;

    analyser.current.fftSize = 32;
    bufferLength.current = analyser.current.frequencyBinCount;
    frequencyArray.current = new Uint8Array(bufferLength.current);
    canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

    animate();
  }, [animate]);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioContext.current = new window.AudioContext();
      if (!source.current) {
        context.current = canvasRef.current.getContext("2d");
        source.current = audioContext.current.createMediaElementSource(
          audioRef.current
        );
        analyser.current = audioContext.current.createAnalyser();
        source.current.connect(analyser.current);
        analyser.current.connect(audioContext.current.destination);
        bufferLength.current = analyser.current.frequencyBinCount;
        drawCircle();
      }
    }
  }, [audioRef, isPlaying, drawCircle]);

  return (
    <div id="container">
      {isPlaying ? (
        <BsPauseCircleFill
          className="play-pause-btn"
          onClick={playPauseToggle}
        />
      ) : (
        <BsFillPlayCircleFill
          className="play-pause-btn"
          onClick={playPauseToggle}
        />
      )}
      <canvas ref={canvasRef} height="250px" id="canvas1" />
    </div>
  );
};

export default AudioPlayer;
