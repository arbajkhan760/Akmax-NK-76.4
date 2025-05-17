
'use client';

import type { FC } from 'react';
import { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Rewind, FastForward, Maximize2, Minimize2, RotateCcw, Download } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

const AudioPlayer: FC<AudioPlayerProps> = ({ src, title }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  // const [isFullScreen, setIsFullScreen] = useState(false); // Basic fullscreen idea, needs more work

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    };

    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));
    audio.addEventListener('ended', () => setIsPlaying(false)); // Reset play on end
    audio.addEventListener('volumechange', () => {
      setIsMuted(audio.muted);
      setVolume(audio.volume);
    });

    // Set initial duration if already loaded
    if (audio.readyState >= 2) { // HAVE_CURRENT_DATA or more
        setAudioData();
    }


    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
      audio.removeEventListener('ended', () => setIsPlaying(false));
      audio.removeEventListener('volumechange', () => {});
    };
  }, []);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(error => console.error("Error playing audio:", error));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };
  
  const handleVolumeChange = (value: number[]) => {
    if (audioRef.current) {
      const newVolume = value[0];
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
      audioRef.current.muted = newVolume === 0;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
      if (!isMuted && audioRef.current.volume === 0) { // If unmuting and volume was 0, set to a default
        audioRef.current.volume = 0.5;
        setVolume(0.5);
      }
    }
  };
  
  const skipTime = (amount: number) => {
      if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, Math.min(duration, audioRef.current.currentTime + amount));
      }
  };


  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md border w-full">
      <audio ref={audioRef} src={src} preload="metadata"></audio>
      {title && <p className="text-sm font-semibold mb-2 truncate text-foreground">{title}</p>}
      
      {/* Progress Bar */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(currentTime)}</span>
        <Slider
          value={[currentTime]}
          max={duration || 0}
          step={1}
          onValueChange={handleSeek}
          className="flex-1"
          aria-label="Audio progress"
        />
        <span className="text-xs text-muted-foreground w-10 text-center">{formatTime(duration)}</span>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1">
           {/* Volume Control */}
            <Button variant="ghost" size="icon" onClick={toggleMute} className="h-8 w-8">
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                <span className="sr-only">{isMuted ? "Unmute" : "Mute"}</span>
            </Button>
            <Slider
                value={[isMuted ? 0 : volume]}
                max={1}
                step={0.05}
                onValueChange={handleVolumeChange}
                className="w-20 h-8"
                aria-label="Volume"
            />
        </div>

        <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" onClick={() => skipTime(-10)} className="h-8 w-8">
                <Rewind className="h-4 w-4" />
                <span className="sr-only">Rewind 10s</span>
            </Button>
            <Button variant="primary" size="icon" onClick={togglePlayPause} className="h-10 w-10">
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                <span className="sr-only">{isPlaying ? "Pause" : "Play"}</span>
            </Button>
             <Button variant="ghost" size="icon" onClick={() => skipTime(10)} className="h-8 w-8">
                <FastForward className="h-4 w-4" />
                <span className="sr-only">Fast-forward 10s</span>
            </Button>
        </div>

        <div className="flex items-center gap-1">
             {/* TODO: Playback Speed, Loop, Download (if allowed) */}
            <Button variant="ghost" size="icon" onClick={() => audioRef.current?.load()} className="h-8 w-8">
                <RotateCcw className="h-4 w-4" />
                <span className="sr-only">Restart</span>
            </Button>
            {/* <Button variant="ghost" size="icon" onClick={() => {}} className="h-8 w-8"><Download className="h-4 w-4" /><span className="sr-only">Download</span></Button> */}
        </div>
      </div>
    </div>
  );
};

export default AudioPlayer;
