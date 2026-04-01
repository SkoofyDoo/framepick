'use client'



interface ScoreCardProps{
    index: number,
    score?: number,
    ok?: boolean,
    imageUrl: string
}


export default function ScoreCard({index, score, ok, imageUrl}: ScoreCardProps) {




    return(
        <div className="bg-zinc-900 rounded-xl p-4">
            <img src={imageUrl} alt="Bild" className="w-full rounded-lg mb-3"/>
            <p>Frame #{index}</p>
            <span>Score: {score?.toFixed(2) ?? 'N/A'}</span>
            <span>{ok  === undefined ? '⏳' : ok ? '✅' : '❌'}</span>
        </div>
    )
}