import ScoreCard from "./ScoreCard"
import { FrameResult } from "../hooks/useVideoSlicer"

interface FrameGalleryProps{
    frames: FrameResult[]
}


export default function FrameGallery({frames}: FrameGalleryProps){
    

    return(
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {frames.map((frame) => (
        <ScoreCard
            key={frame.index}
            index={frame.index}
            score={frame.score}
            ok={frame.ok}
            imageUrl={frame.imageUrl}
        />
        ))}
        </div>
    )
}