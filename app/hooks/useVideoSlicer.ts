import {useState, useRef} from 'react'

export interface FrameResult {
    index: number,
    blob: Blob, 
    score?: number,
    ok?: boolean,
    imageUrl: string
}
// interface VideoWithVFC extends HTMLVideoElement {
//     requestVideoFrameCallback: (callback: () => void) => void
// }


export function useVideoSlicer(){
    const [frames, setFrames] = useState<FrameResult[]>([])
    const [progress, setProgress] = useState(0)
    const [isProcessing, setIsProcessing] = useState(false)
    
    // Debug für Safari
    const [logs, setLogs] = useState<string[]>([])
    
    const workerRef = useRef<Worker | null>(null)
    

    async function processVideoFallback(file: File, maxFrames: number) {
        
        const video = document.createElement('video')
        video.src = URL.createObjectURL(file)
        video.muted = true
        video.playsInline = true
        video.preload = 'auto'

        await new Promise<void>((resolve) => {
            video.onloadedmetadata = () => resolve()
        })

        const {videoWidth, videoHeight, duration} = video
        const interval = duration / maxFrames
        const canvas = document.createElement('canvas')
        const maxWidth = 1024
        const aspect = videoWidth / videoHeight
        
        canvas.width = maxWidth
        canvas.height = Math.round(maxWidth / aspect)
        const ctx = canvas.getContext('2d')

        for (let i = 0; i < maxFrames; i++){
            await new Promise<void>((resolve) => {
                video.onseeked = async () => {
                    if('requestVideoFrameCallback' in video){
                        await new Promise<void>(resolve => {
                            video.requestVideoFrameCallback(() => resolve())
                        })
                           
                        } else {  
                            await new Promise(r => setTimeout(r, 100))
                    }
                    setLogs(prev => [...prev, `Seeking frame ${i}`])
                    ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
                    canvas.toBlob((blob) => {
                        if(blob){
                            const imageUrl = URL.createObjectURL(blob)
                            
                            setFrames(prev => [...prev, {index: i, blob, imageUrl}])
                            setProgress(Math.round(((i + 1) / maxFrames) * 100))
                        }
                        resolve()
                    }, 'image/jpeg', 0.7)
                }
                video.currentTime = i * interval
                    
            })
        }
        setIsProcessing(false)
        URL.revokeObjectURL(video.src)
        }

        async function processVideo(file: File, maxFrames: number = 100){
            setIsProcessing(true)
            setFrames([])
            setProgress(0)
            const supportsWorker = typeof Worker !== 'undefined' && 
                           typeof OffscreenCanvas !== 'undefined'
            
            if(!supportsWorker){
                await processVideoFallback(file, maxFrames)
                return
            }
            const worker = new Worker('/videoWorker.js')
            workerRef.current = worker

            const video = document.createElement('video')
            video.src = URL.createObjectURL(file)
            video.muted = true
            video.playsInline = true
            video.preload = 'auto';
            

            await new Promise<void>((resolve) => {
                video.onloadedmetadata = () => resolve()
            })

            const {videoWidth, videoHeight, duration} = video
            const interval = duration / maxFrames
            const canvas = document.createElement('canvas')
            const maxWidth = 1024
            const aspect = videoWidth / videoHeight
            
            canvas.width = maxWidth
            canvas.height = Math.round(maxWidth / aspect)
            const ctx = canvas.getContext('2d')

            let completed = 0

            worker.onmessage = (event) => {
                const {blob, index} = event.data
                const imageUrl = URL.createObjectURL(blob)
                setLogs(prev => [...prev, `Worker Frame ${index} recieved`])
                setFrames(prev =>[...prev, {index, blob, imageUrl}])
                completed++
                setProgress(Math.round((completed / maxFrames) * 100))
                if(completed === maxFrames){
                    setIsProcessing(false)
                    URL.revokeObjectURL(video.src)
                }
            }

            for (let i = 0; i < maxFrames; i++){
                await new Promise<void>((resolve) => {
                    video.onseeked = async () => {
                        await new Promise(r => setTimeout(r, 100))
                        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height)
                        const bitmap = await createImageBitmap(canvas)
                        worker.postMessage(
                            {bitmap, index: i, width: canvas.width, height: canvas.height},
                            [bitmap]
                        )
                        resolve()
                    }
                    video.currentTime = i * interval
                    setLogs(prev => [...prev, `Seeking to frame ${i}`])
                })
            }

            worker.onerror = (error) => {
                console.error('Worker Error', error)
                setIsProcessing(false)
            }

        


        }

        function cancel() {
            workerRef.current?.terminate()
            setIsProcessing(false)
            setFrames([])
            setProgress(0)
        }
        return {frames, progress, isProcessing, processVideo, cancel, logs} 
}     