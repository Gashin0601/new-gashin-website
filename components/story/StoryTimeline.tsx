"use client";

import StoryChapter from "./StoryChapter";

interface StoryTimelineProps {
    timelineData: any[];
}

export default function StoryTimeline({ timelineData }: StoryTimelineProps) {
    return (
        <section
            className="relative max-w-6xl mx-auto px-6 py-20"
            aria-label="鈴木我信の人生のタイムライン"
        >
            <h2 className="sr-only">タイムライン</h2>
            <div
                className="space-y-32"
                role="list"
                aria-label="人生の章"
            >
                {timelineData.map((chapter, index) => (
                    <StoryChapter
                        key={chapter.chapter}
                        data={chapter}
                        index={index}
                        totalChapters={timelineData.length}
                    />
                ))}
            </div>
        </section>
    );
}
