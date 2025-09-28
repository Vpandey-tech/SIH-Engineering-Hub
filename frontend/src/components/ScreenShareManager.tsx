// src/components/ScreenShareManager.tsx
import React, { useRef, useEffect } from 'react';

interface ScreenShareManagerProps {
  isSharing: boolean;
  onStreamChange: (stream: MediaStream | null, imageCapture: ImageCapture | null) => void;
  onSharingEnd: () => void;
}

const ScreenShareManager: React.FC<ScreenShareManagerProps> = ({
  isSharing,
  onStreamChange,
  onSharingEnd,
}) => {
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    const manageStream = async () => {
      if (isSharing) {
        await startScreenShare();
      } else {
        stopScreenShare();
      }
    };

    manageStream();

    return () => {
      stopScreenShare();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSharing]);

  const startScreenShare = async () => {
    try {
      // FIX: Removed the non-standard 'mediaSource' property to resolve the TypeScript error.
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          width: { ideal: 1920 },
          height: { ideal: 1080 },
          frameRate: { ideal: 30 },
        },
        audio: false,
      });

      const videoTrack = stream.getVideoTracks()[0];
      const imageCapture = new ImageCapture(videoTrack);

      streamRef.current = stream;
      onStreamChange(stream, imageCapture);

      // Listen for when the user clicks the browser's "Stop sharing" button
      videoTrack.onended = () => {
        onSharingEnd();
      };
    } catch (error) {
      console.error('Error starting screen share:', error);
      onSharingEnd(); // Ensure we toggle off if the user cancels the share prompt
    }
  };

  const stopScreenShare = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    // Notify the parent component that the stream is gone
    onStreamChange(null, null);
  };

  // This component manages logic and does not render any UI
  return null;
};

export default ScreenShareManager;