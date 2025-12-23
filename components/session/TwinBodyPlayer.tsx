'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';

interface PoseKeypoint {
  x: number;
  y: number;
  score: number;
  name: string;
}

interface PoseFrame {
  timestamp: number;
  keypoints: PoseKeypoint[];
}

interface TwinBodyPlayerProps {
  videoUrl: string;
  poseData?: PoseFrame[];
  synced?: boolean;
  onTimeUpdate?: (time: number) => void;
}

// Skeleton connections for visualization
const SKELETON_CONNECTIONS = [
  ['nose', 'left_eye'], ['nose', 'right_eye'],
  ['left_eye', 'left_ear'], ['right_eye', 'right_ear'],
  ['left_shoulder', 'right_shoulder'],
  ['left_shoulder', 'left_elbow'], ['right_shoulder', 'right_elbow'],
  ['left_elbow', 'left_wrist'], ['right_elbow', 'right_wrist'],
  ['left_shoulder', 'left_hip'], ['right_shoulder', 'right_hip'],
  ['left_hip', 'right_hip'],
  ['left_hip', 'left_knee'], ['right_hip', 'right_knee'],
  ['left_knee', 'left_ankle'], ['right_knee', 'right_ankle'],
];

export function TwinBodyPlayer({
  videoUrl,
  poseData = [],
  synced = true,
  onTimeUpdate,
}: TwinBodyPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentFrame, setCurrentFrame] = useState<PoseFrame | null>(null);

  // Find the pose frame closest to the current video time
  const findClosestFrame = useCallback((time: number) => {
    if (!poseData || poseData.length === 0) return null;

    let closest = poseData[0];
    let minDiff = Math.abs(time - closest.timestamp);

    for (const frame of poseData) {
      const diff = Math.abs(time - frame.timestamp);
      if (diff < minDiff) {
        minDiff = diff;
        closest = frame;
      }
    }

    return closest;
  }, [poseData]);

  // Draw skeleton on canvas
  const drawSkeleton = useCallback((frame: PoseFrame) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0d0d0d';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const keypoints = frame.keypoints;
    const keypointMap = new Map(keypoints.map(kp => [kp.name, kp]));

    // Draw connections
    ctx.strokeStyle = '#d4a373';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';

    for (const [start, end] of SKELETON_CONNECTIONS) {
      const startKp = keypointMap.get(start);
      const endKp = keypointMap.get(end);

      if (startKp && endKp && startKp.score > 0.3 && endKp.score > 0.3) {
        ctx.beginPath();
        ctx.moveTo(startKp.x * canvas.width, startKp.y * canvas.height);
        ctx.lineTo(endKp.x * canvas.width, endKp.y * canvas.height);
        ctx.stroke();
      }
    }

    // Draw keypoints
    for (const kp of keypoints) {
      if (kp.score > 0.3) {
        // Outer glow
        ctx.fillStyle = 'rgba(212, 163, 115, 0.3)';
        ctx.beginPath();
        ctx.arc(kp.x * canvas.width, kp.y * canvas.height, 8, 0, Math.PI * 2);
        ctx.fill();

        // Inner point
        ctx.fillStyle = '#9d8189';
        ctx.beginPath();
        ctx.arc(kp.x * canvas.width, kp.y * canvas.height, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Draw "tethered" indicator
    ctx.fillStyle = '#d4a373';
    ctx.font = '10px monospace';
    ctx.textAlign = 'left';
    ctx.fillText('COMPUTABLE BODY', 10, 20);
  }, []);

  // Handle video time update
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const time = video.currentTime;
    setCurrentTime(time);
    onTimeUpdate?.(time);

    if (synced && poseData.length > 0) {
      const frame = findClosestFrame(time);
      if (frame) {
        setCurrentFrame(frame);
        drawSkeleton(frame);
      }
    }
  };

  // Handle video loaded
  const handleLoadedMetadata = () => {
    const video = videoRef.current;
    if (video) {
      setDuration(video.duration);
    }
  };

  // Toggle play/pause
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek to time
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Draw initial skeleton state if no video
  useEffect(() => {
    if (poseData.length > 0 && !currentFrame) {
      const frame = poseData[0];
      setCurrentFrame(frame);
      drawSkeleton(frame);
    }
  }, [poseData, currentFrame, drawSkeleton]);

  return (
    <div className="w-full">
      {/* Twin Bodies Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Evidentiary Body (Video) */}
        <div className="relative aspect-video bg-[#0d0d0d] rounded-lg overflow-hidden border border-[#333]">
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full h-full object-contain"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            playsInline
          />
          <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 rounded text-[10px] font-mono text-[#d4a373]">
            EVIDENTIARY BODY
          </div>
        </div>

        {/* Computable Body (Skeleton) */}
        <div className="relative aspect-video bg-[#0d0d0d] rounded-lg overflow-hidden border border-[#333]">
          <canvas
            ref={canvasRef}
            width={640}
            height={360}
            className="w-full h-full object-contain"
          />
          {poseData.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-[#666] text-sm font-mono">No pose data available</p>
            </div>
          )}
        </div>
      </div>

      {/* Tethered Connection Indicator */}
      <div className="flex items-center justify-center gap-3 mb-4">
        <motion.div
          className="w-2 h-2 rounded-full bg-[#d4a373]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
        <span className="text-xs font-mono text-[#666] uppercase tracking-wider">
          {synced ? 'Bodies Tethered' : 'Bodies Untethered'}
        </span>
        <motion.div
          className="w-2 h-2 rounded-full bg-[#d4a373]"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, delay: 1 }}
        />
      </div>

      {/* Playback Controls */}
      <div className="bg-[#1f1f1f] rounded-lg p-4 border border-[#333]">
        <div className="flex items-center gap-4">
          {/* Play/Pause Button */}
          <button
            onClick={togglePlay}
            className="w-10 h-10 rounded-full bg-[#d4a373] text-[#0d0d0d] flex items-center justify-center hover:bg-[#e5b484] transition-colors"
          >
            {isPlaying ? (
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="4" width="4" height="16" />
                <rect x="14" y="4" width="4" height="16" />
              </svg>
            ) : (
              <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Time Display */}
          <span className="font-mono text-sm text-[#a0a0a0] min-w-[100px]">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>

          {/* Progress Bar */}
          <div className="flex-1 relative">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-2 rounded-full appearance-none bg-[#333] cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-4
                [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-[#d4a373]
                [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:transition-transform
                [&::-webkit-slider-thumb]:hover:scale-125"
            />
            <div
              className="absolute top-0 left-0 h-2 rounded-full bg-[#d4a373]/50 pointer-events-none"
              style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TwinBodyPlayer;
