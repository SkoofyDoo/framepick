'use client'
import {useState, useRef} from 'react'

interface DropzoneProps {
    onFileSelect: (file: File) => void
} 

export default function Dropzone({onFileSelect}: DropzoneProps){

    const [fileName, setFileName] = useState<string | null> (null)

    const inputRef = useRef<HTMLInputElement>(null)

    function onDragOver(event: React.DragEvent<HTMLDivElement>) {
        event.preventDefault()
    }
    
    function onDrop(event: React.DragEvent<HTMLDivElement>){
        event.preventDefault()
        const file = event.dataTransfer.files?.[0]
        if(!file) return
        setFileName(file.name)
        onFileSelect(file)
    }

    function onChange(event: React.ChangeEvent<HTMLInputElement>){
        
        const file = event.target.files?.[0]
        if(!file) return
        setFileName(file.name)
        onFileSelect(file)
    }

    

    return(

        <div className='hover:cursor-pointer' onClick={() => inputRef.current?.click()}>
            <p>{fileName ?? 'Keine Datei ausgewählt'}</p>
            <div className='border-2 border-dashed border-white/30 rounded-xl p-16 text-center' onDrop={onDrop} onDragOver={onDragOver}>
                <p>Drag & Drop oder Click</p>
                <input type='file' ref={inputRef} onChange={onChange} className='hidden'/>
            </div>
        </div>
        
    )
    

}


