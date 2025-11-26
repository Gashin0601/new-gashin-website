// Shared video preloader with cache
// This ensures videos are only loaded once and shared across components

export const preloadedVideos: Map<string, HTMLVideoElement> = new Map();
export const loadingPromises: Map<string, Promise<HTMLVideoElement>> = new Map();
// Track which videos are currently in use (taken from cache)
const inUseVideos: Map<string, HTMLVideoElement> = new Map();

function createVideoElement(src: string): HTMLVideoElement {
    const video = document.createElement('video');
    video.preload = 'auto';
    video.muted = true; // Start muted for preloading
    video.playsInline = true;
    video.autoplay = false;
    video.loop = true;

    // iOS Safari requires setAttribute for playsinline
    video.setAttribute('playsinline', '');
    video.setAttribute('webkit-playsinline', '');
    // Don't set muted attribute - control via JS property only

    // Use src directly for better caching
    video.src = src;

    return video;
}

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
        const video = createVideoElement(src);

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

// Take a preloaded video from cache (removes it from cache while in use)
export function takePreloadedVideo(src: string): HTMLVideoElement | null {
    const video = preloadedVideos.get(src);
    if (video) {
        preloadedVideos.delete(src);
        inUseVideos.set(src, video);
        // Remove muted attribute so it can be properly controlled via JS
        video.removeAttribute('muted');
        return video;
    }
    return null;
}

// Return a video back to the cache when done
export function returnPreloadedVideo(src: string, video: HTMLVideoElement): void {
    inUseVideos.delete(src);
    // Reset video state before returning to cache
    video.pause();
    video.currentTime = 0;
    video.muted = true;
    preloadedVideos.set(src, video);
}

// Get a preloaded video without removing from cache (for checking)
export function getPreloadedVideo(src: string): HTMLVideoElement | undefined {
    return preloadedVideos.get(src);
}

export function isVideoPreloaded(src: string): boolean {
    return preloadedVideos.has(src) || inUseVideos.has(src);
}

// Check if video data is ready (either in cache or in use)
export function isVideoReady(src: string): boolean {
    const video = preloadedVideos.get(src) || inUseVideos.get(src);
    return video ? video.readyState >= 2 : false;
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
