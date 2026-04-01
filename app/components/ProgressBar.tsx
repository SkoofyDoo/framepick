interface ProgressBarProps{
    current: number,
    total: number
}

export default function ProgressBar({current, total}: ProgressBarProps) {

    const percent = Math.round((current / total) * 100)

    return (
        <div>
            <p>{current} / {total} - {percent}%</p>
        <div className="w-full bg-zinc-700 rounded-full h-2 mt-2">
            <div 
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${percent}%` }}
            />
            </div>
        </div>
    )

}