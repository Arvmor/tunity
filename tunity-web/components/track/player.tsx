"use client"

import { Dispatch, SetStateAction, useRef, useState } from "react";
import TrackItem, { ItemProps } from "@/components/track/item";
import XPay, { PayProps, useXPayAsync } from "@/components/privy/pay";
import { Check, FastForward, Pause, Play, Rewind } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { PlayRequest } from "@/packages/tunity-sdk/src/types";
import { Input } from "../ui/input";
import { UUID } from "crypto";

const API_BASE_URL = process.env.NEXT_PUBLIC_TUNITY_API_URL ?? "http://127.0.0.1:80";

/** The MIME types */
const AUDIO_MIME = "audio/mpeg";
const VIDEO_MIME = "video/mp4";

/** The payment properties for the audio track */
const propPay: PayProps = {
    url: `${API_BASE_URL}/play`,
    body: {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
    },
    maxValue: BigInt(1000),
}

/** The track player component */
export default function TrackPlayer({title, name, image, size}: ItemProps) {
    const [playRequest, setPlayRequest] = useState<PlayRequest | null>(null);
    
    const { url, maxValue } = propPay;
    const body = {
        ...propPay.body,
        body: JSON.stringify(playRequest),
    };

    return (
        <div className="flex flex-col gap-4">
            {/* Track info */}
            <TrackItem title={title} name={name} image={image} size={size} />
            <ContentInput onSubmit={setPlayRequest} />
            {/* Audio element */}
            <XPay>
                <PlayIslands url={url} body={body} maxValue={maxValue} />
            </XPay>
        </div>
    )
}

/** The play islands component */
export function PlayIslands({url, body, maxValue}: PayProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const ref = useRef<HTMLAudioElement | null>(null);
    const XPayAsync = useXPayAsync();

    // Function to handle time update of the track
    const onTimeUpdate = () => {
        if (ref.current) {
            setCurrentTime(ref.current.currentTime);
            setDuration(ref.current.duration);
        }
    };

    /** Handles paying, playing and pausing the track */
    const handlePlay = async () => {
        if (!ref.current) return;

        // Check if the user has paid for the track
        if (!isPaid) {
            const {status, data} = await XPayAsync({url, body, maxValue});
            if (status !== 'Success') return;
            setPlayerData(data, ref.current, AUDIO_MIME);
            setIsPaid(true);
        }

        // Play the track
        handlePlayPause(setIsPlaying, ref.current);
    }

    return (
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" onClick={handlePlay}>
                {isPlaying ? <Pause /> : <Play /> }
            </Button>
            <Slider defaultValue={[0]} value={[currentTime]} max={duration} />
            <Button variant="ghost" size="icon"><Rewind /></Button>
            <Button variant="ghost" size="icon"><FastForward /></Button>
            <audio ref={ref} onTimeUpdate={onTimeUpdate} hidden/>
        </div>
    )
}

/** Movie Player component */
export function MoviePlayer({ title, name }: ItemProps) {
    const [playRequest, setPlayRequest] = useState<PlayRequest | null>(null);

    const { url, maxValue } = propPay;
    const body = {
        ...propPay.body,
        body: JSON.stringify(playRequest),
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-md font-bold">{title}</h2>
                <h3 className="text-muted-foreground">{name}</h3>
                <ContentInput onSubmit={setPlayRequest} />
            </div>
            <XPay>
                <MoviePlayIslands url={url} body={body} maxValue={maxValue} />
            </XPay>
        </div>
    );
}

/** The movie play islands component */
export function MoviePlayIslands({url, body, maxValue}: PayProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaid, setIsPaid] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const ref = useRef<HTMLVideoElement | null>(null);
    const XPayAsync = useXPayAsync();

    // Function to handle time update of the movie
    const onTimeUpdate = () => {
        if (ref.current) {
            setCurrentTime(ref.current.currentTime);
            setDuration(ref.current.duration);
        }
    };

    // Function to handle playing and pausing the movie
    const handlePlay = async () => {
        if (!ref.current) return;

        // Check if the user has paid for the movie
        if (!isPaid) {
            const {status, data} = await XPayAsync({url, body, maxValue});
            if (status !== 'Success') return;
            setPlayerData(data, ref.current, VIDEO_MIME);
            setIsPaid(true);
        }

        handlePlayPause(setIsPlaying, ref.current);
    }

    return (
        <div className="flex flex-col">
            <video ref={ref} onTimeUpdate={onTimeUpdate} controls/>
            <div className="flex w-full items-center gap-4">
                <Button variant="outline" size="icon" onClick={handlePlay}>
                    {isPlaying ? <Pause /> : <Play /> }
                </Button>
                <Slider defaultValue={[0]} value={[currentTime]} max={duration} />
                <Button variant="ghost" size="icon"><Rewind /></Button>
                <Button variant="ghost" size="icon"><FastForward /></Button>
            </div>
        </div>
    )
}

/** Handle the play/pause state */
function handlePlayPause(setState: Dispatch<SetStateAction<boolean>>, player: HTMLAudioElement | HTMLVideoElement) {
    setState((prev: boolean) => {
        // Play/pause the player
        if (prev) player.pause(); 
        else player.play();
        
        return !prev;
    });
}

/** Set the audio data to the player */
function setPlayerData(data: number[], player: HTMLAudioElement | HTMLVideoElement, type: string) {
    const bytes = new Uint8Array(data);
    const blob = new Blob([bytes], { type });

    // Create & Clean the object URL
    URL.revokeObjectURL(player.src);
    player.src = URL.createObjectURL(blob);
}

interface ContentInputProps {
    onSubmit: (request: PlayRequest) => void;
}

export function ContentInput({ onSubmit }: ContentInputProps) {
    const [key, setKey] = useState("");
    const [offset, setOffset] = useState("0");
    const [length, setLength] = useState("0");
    const [statusMessage, setStatusMessage] = useState("");

    const isValid = key.length > 0 && !isNaN(Number(offset)) && !isNaN(Number(length));

    const handleSubmit = () => {
        if (!isValid) return;
        onSubmit({
            key: key as UUID,
            offset: Number(offset),
            length: Number(length),
        });
        setStatusMessage("Content set successfully");
    };

    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
                <Input
                    type="text"
                    placeholder="Content UUID"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                />
            </div>
            <div className="flex items-center gap-2">
                <Input
                    type="number"
                    placeholder="Offset"
                    value={offset}
                    onChange={(e) => setOffset(e.target.value)}
                />
                <Input
                    type="number"
                    placeholder="Length"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                />
                <Button size="icon" onClick={handleSubmit} disabled={!isValid}>
                    <Check />
                </Button>
            </div>
            {/* Status message */}
            {statusMessage && <p className="text-sm text-green-600">{statusMessage}</p>}
        </div>
    );
}