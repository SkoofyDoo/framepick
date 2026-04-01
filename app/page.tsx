'use client'


import Dropzone from "./components/Dropzone";
import ProgressBar from './components/ProgressBar';
import FrameGallery from './components/FrameGallery'
import { useVideoSlicer } from './hooks/useVideoSlicer';

export default function Home() {
 
  const { frames, progress, isProcessing, processVideo } = useVideoSlicer()
  return (
    <div className="min-h-screen bg-black text-white p-10">
      <h1 className="text-3xl font-bold mb-8">FramePick</h1>
      <Dropzone onFileSelect={(file) => processVideo(file)} />
      {isProcessing && <ProgressBar current={progress} total={100} />}
      {frames.length > 0 && <FrameGallery frames={frames} />}
    </div>
  );
}
