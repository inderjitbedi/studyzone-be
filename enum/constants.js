module.exports = Object.freeze({
    PDF_CONFIG: {
        MAX_SIZE: 100 * 1024 * 1024,
        ALLOWED_EXTENSIONS: ['pdf'],
        ALLOWED_EXTENSIONS_REGEX: /pdf/,
        MIME_TYPES: ['application/pdf'],
        FOLDER_NAME: 'pdfs'
    },
    VIDEO_CONFIG: {
        MAX_SIZE: 200 * 1024 * 1024,
        ALLOWED_EXTENSIONS: ['mp4', 'ogg', 'webm'],
        ALLOWED_EXTENSIONS_REGEX: /mp4|ogg|webm/,
        MIME_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
        FOLDER_NAME: 'videos'
    },
    AUDIO_CONFIG: {
        MAX_SIZE: 200 * 1024 * 1024,
        ALLOWED_EXTENSIONS:['mp3', 'ogg', 'wav'],
        ALLOWED_EXTENSIONS_REGEX: /mp3|ogg|wav|mpeg/,
        MIME_TYPES: ['audio/mpeg','audio/ogg','audio/wav'],
        FOLDER_NAME: 'audios'
    }
});