"use client"

import { useEffect, useRef, useState } from "react";
import TrackItem, { ItemProps } from "@/components/track/item";
import XPay, { PayProps } from "@/components/privy/pay";
import { ApiResponse } from "@/types/api";

const propPay: PayProps = {
    url: "http://localhost/play",
    action: "Play",
    maxValue: BigInt(1000),
}

const AUDIO_TYPE = "audio/mpeg";

export default function TrackPlayer({title, name, image, size}: ItemProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [data, setData] = useState<ApiResponse<number[], any>>();
    const { url, action, maxValue } = propPay;

    useEffect(() => {
        if (!audioRef.current || !data?.data || data.status !== 'Success') return;

        const bytes = new Uint8Array(data.data);
        const blob = new Blob([bytes], { type: AUDIO_TYPE });
        const objectUrl = URL.createObjectURL(blob);
        
        const previousUrl = audioRef.current.src;
        audioRef.current.src = objectUrl;

        return () => {
            URL.revokeObjectURL(objectUrl);
            if (previousUrl && previousUrl.startsWith('blob:')) {
                URL.revokeObjectURL(previousUrl);
            }
        };
    }, [data]);

    return (
        <div>
            <h1 className="text-2xl font-bold">Track Player</h1>
            {/* Track info */}
            <TrackItem title={title} name={name} image={image} size={size} />
            {/* Audio element */}
            <audio ref={audioRef} controls />
            {/* Play button */}
            <XPay url={url} action={action} maxValue={maxValue} setData={setData} />
        </div>
    )
}