self.onmessage = async function(event){
    const { bitmap, index, width, height} = event.data

    const canvas = new OffscreenCanvas(width, height)
    const ctx = canvas.getContext('2d')

    ctx.drawImage(bitmap, 0, 0, width, height)

    const blob = await canvas.convertToBlob({type: 'image/jpeg', quality: 0.9})

    bitmap.close()

    self.postMessage({type: 'frame', blob, index})
}