// Shared video preloader with cache
// This ensures videos are only loaded once and shared across components

export const preloadedVideos: Map<string, HTMLVideoElement> = new Map();
export const loadingPromises: Map<string, Promise<HTMLVideoElement>> = new Map();

export function preloadVideo(src: string): Promise<HTMLVideoElement> {
    // Return cached video if available
    if (preloadedVideos.has(src)) {
        return Promise.resolve(preloadedVideos.get(src)!);
    }

    // Return existing loading promise if already loading
    if (loadingPromises.has(src)) {
        return loadingPromises.get(src)!;
    }

    // Create new loading promise
    const promise = new Promise<HTMLVideoElement>((resolve) => {
        const video = document.createElement('video');
        video.preload = 'auto';
        video.muted = true;
        video.playsInline = true;
        video.autoplay = false; // Don't autoplay during preload
        video.loop = true;

        // iOS Safari requires setAttribute
        video.setAttribute('playsinline', '');
        video.setAttribute('webkit-playsinline', '');
        video.setAttribute('muted', '');
        video.crossOrigin = 'anonymous';

        // Use source element with type for iOS Safari compatibility
        const source = document.createElement('source');
        source.src = src;
        source.type = 'video/mp4';
        video.appendChild(source);

        let resolved = false;
        const handleReady = () => {
            if (resolved) return;
            resolved = true;
            preloadedVideos.set(src, video);
            loadingPromises.delete(src);
            resolve(video);
        };

        video.oncanplaythrough = handleReady;
        video.onloadeddata = handleReady;
        video.onerror = () => {
            // Resolve even on error to not block loading
            handleReady();
        };

        // Start loading
        video.load();

        // Timeout fallback (10 seconds)
        setTimeout(handleReady, 10000);
    });

    loadingPromises.set(src, promise);
    return promise;
}

export function getPreloadedVideo(src: string): HTMLVideoElement | undefined {
    return preloadedVideos.get(src);
}

export function isVideoPreloaded(src: string): boolean {
    return preloadedVideos.has(src);
}

export async function preloadAllVideos(
    videos: { videoSrc: string }[],
    onProgress?: (loaded: number, total: number) => void
): Promise<void> {
    const total = videos.length;
    let loaded = 0;

    const promises = videos.map(async (video) => {
        await preloadVideo(video.videoSrc);
        loaded++;
        onProgress?.(loaded, total);
    });

    await Promise.all(promises);
}
