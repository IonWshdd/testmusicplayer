import React, { useState, useRef, useEffect, useCallback } from 'react';
import { songsData } from '../constants/data.js';

const formatTime = (seconds) => {
  return new Date(seconds * 1000).toISOString().substr(14, 5);
};

const Track = () => {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(new Audio());
  const progressBarRef = useRef(null);
  const [volume, setVolume] = useState(1);

  const setAudioData = useCallback(() => {
    setDuration(audioRef.current.duration);
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const updateProgress = useCallback(() => {
    setCurrentTime(audioRef.current.currentTime);
  }, []);

  const onSongEnd = useCallback(() => {
    if (!isLooping) {
      setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
    }
  }, [isLooping]);

  // Effect for audio source loading
  useEffect(() => {
    const currentAudio = audioRef.current;
    currentAudio.src = songsData[currentSongIndex].song_url;
    currentAudio.loop = isLooping;

    currentAudio.addEventListener('loadeddata', setAudioData);
    currentAudio.addEventListener('timeupdate', updateProgress);
    currentAudio.addEventListener('ended', onSongEnd);

    // Attempt to play if already in playing state, handling autoplay policy
    if (isPlaying) {
      currentAudio.play().catch((e) => console.log('Playback was prevented:', e));
    }

    return () => {
      currentAudio.removeEventListener('loadeddata', setAudioData);
      currentAudio.removeEventListener('timeupdate', updateProgress);
      currentAudio.removeEventListener('ended', onSongEnd);
    };
  }, [currentSongIndex, isLooping, setAudioData, updateProgress, onSongEnd]);

  // Volume control effect
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  // Play/Pause effect
  useEffect(() => {
    const playPause = async () => {
      if (isPlaying) {
        await audioRef.current.play().catch((e) => console.error('Playback was prevented:', e));
      } else {
        audioRef.current.pause();
      }
    };

    playPause();
  }, [isPlaying]);

  const playPauseHandler = useCallback(() => {
    setIsPlaying(!isPlaying);
  }, [isPlaying]);

  const nextSongHandler = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex < songsData.length - 1 ? prevIndex + 1 : 0));
  }, []);

  const prevSongHandler = useCallback(() => {
    setCurrentSongIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : songsData.length - 1));
  }, []);

  const toggleLoopHandler = useCallback(() => {
    setIsLooping(!isLooping);
  }, [isLooping]);

  const changeProgressBar = useCallback((e) => {
    const width = progressBarRef.current.clientWidth;
    const clickX = e.nativeEvent.offsetX;
    const newTime = (clickX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); // Update currentTime based on progress bar click
  }, []);

  const volumeControlHandler = (e) => {
    setVolume(e.target.value);
  };

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-800 text-white">
      <div className="flex items-center justify-center space-x-4">
        <button onClick={prevSongHandler} className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-full">
          Prev
        </button>
        <button onClick={playPauseHandler} className="px-4 py-2 text-lg bg-blue-500 hover:bg-blue-400 rounded-full">
          {isPlaying ? 'Pause' : 'Play'}
        </button>
        <button onClick={nextSongHandler} className="px-4 py-2 text-lg bg-gray-700 hover:bg-gray-600 rounded-full">
          Next
        </button>
        <button onClick={toggleLoopHandler} className={`px-4 py-2 text-lg ${isLooping ? 'bg-green-500' : 'bg-gray-700'} hover:bg-gray-600 rounded-full`}>
          {isLooping ? 'Looping' : 'Loop'}
        </button>
      </div>
      <div className="mt-8 text-center">
        <p className="text-xl">Now playing: <span className="text-blue-400">{songsData[currentSongIndex].song_name}</span></p>
        <p className="text-lg">by <span className="text-blue-400">{songsData[currentSongIndex].artist_name}</span></p>
      </div>
      <div className="flex items-center w-4/5 max-w-6xl mt-4">
        <span className="text-xs text-gray-400">{formatTime(currentTime)}</span>
        <div className="flex-1 mx-4 bg-gray-700 rounded-full" onClick={changeProgressBar} ref={progressBarRef}>
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="text-xs text-gray-400">{formatTime(duration)}</span>
      </div>
      {/* Volume Slider */}
      <div className="volume-control mt-4">
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={volumeControlHandler}
          className="volume-slider"
        />
      </div>
    </div>
  );
}

export default Track;