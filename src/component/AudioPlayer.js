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
  const barWidth = useRef();
  const x = useRef();
  const rafId = useRef();
  const WIDTH = useRef();
  const HEIGHT = useRef();

  const playPauseToggle = () => {
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(!isPlaying);
      cancelAnimationFrame(rafId.current);
    } else {
      audioRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const animate = useCallback(() => {
    //Circular bars
    /*
        x.current = 0;
    context.current.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    analyser.current.getByteFrequencyData(frequencyArray.current);

    for (let i = 0; i < bufferLength.current; i++) {
      barHeight.current = frequencyArray.current[i] / 3;
      context.current.save();
      context.current.translate(
        canvasRef.current.width / 2,
        canvasRef.current.height / 2
      );
      context.current.rotate(i + (Math.PI * 2) / bufferLength.current);
      context.current.fillStyle = "white";
      context.current.fillRect(0, 0, barWidth.current, 15);

      context.current.fillStyle = "#1976d2";
      context.current.fillRect(0, 0, barWidth.current, barHeight.current);
      x.current += barWidth.current;
      context.current.restore();
    }
    */
    analyser.current.smoothingTimeConstant = 0.5;
    WIDTH.current = canvasRef.current.width = window.innerWidth;
    HEIGHT.current = canvasRef.current.height = window.innerHeight;
    barWidth.current = (WIDTH.current * 1.0) / bufferLength.current;

    x.current = 0;
    context.current.fillStyle = "#000";
    context.current.fillRect(0, 0, WIDTH.current, HEIGHT.current);
    context.current.lineWidth = 1;
    context.current.strokeStyle = "#fff";
    context.current.beginPath();
    context.current.stroke();
    context.current.closePath();

    analyser.current.getByteFrequencyData(frequencyArray.current);

    analyser.current.getByteTimeDomainData(frequencyArray.current);
    context.current.lineWidth = 1;
    context.current.strokeStyle = "#fff";
    context.current.beginPath();
    x.current = 0;
    for (let i = 0; i < bufferLength.current; i++) {
      context.current.save();
      context.current.translate(
        canvasRef.current.width / 2,
        canvasRef.current.height / 2
      );
      context.current.rotate(i + (Math.PI * 128) / bufferLength.current);

      const v = frequencyArray.current[i] / 128.0;
      const y = (v * HEIGHT.current) / 2;

      if (i === 0) {
        context.current.moveTo(x.current, y);
      } else {
        context.current.lineTo(x.current, y);
      }

      x.current = i * barWidth.current;
      context.current.restore();
    }
    context.current.lineTo(
      WIDTH.current,
      (frequencyArray.current[0] / 128.0) * HEIGHT.current
    );
    context.current.stroke();
    rafId.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioContext.current = new window.AudioContext();
      if (!source.current) {
        context.current = canvasRef.current.getContext("2d");
        source.current = audioContext.current.createMediaElementSource(
          audioRef.current
        );
        analyser.current = audioContext.current.createAnalyser();
        const listen = audioContext.current.createGain();
        source.current.connect(listen);
        listen.connect(analyser.current);
        analyser.current.connect(audioContext.current.destination);
        analyser.current.fftSize = 2048;
      }
      bufferLength.current = analyser.current.frequencyBinCount;
      frequencyArray.current = new Uint8Array(bufferLength.current);
      barWidth.current = canvasRef.current.width / bufferLength.current;
      animate();
    }
  }, [audioRef, isPlaying, animate]);

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
      <canvas ref={canvasRef} id="canvas1" />
    </div>
  );
};

export default AudioPlayer;
