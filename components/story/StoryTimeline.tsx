"use client";

import StoryChapter from "./StoryChapter";

interface StoryTimelineProps {
    timelineData: any[];
}

export default function StoryTimeline({ timelineData }: StoryTimelineProps) {
    return (
        <div className="relative max-w-6xl mx-auto px-6 py-20">

            <div className="space-y-32">
                {timelineData.map((chapter, index) => (
                    <StoryChapter key={chapter.chapter} data={chapter} index={index} />
                ))}
            </div>
        </div>
    );
}
