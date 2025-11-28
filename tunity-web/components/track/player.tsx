import { Button } from "@/components/ui/button";
import TrackItem, { ItemProps } from "@/components/track/item";

export default function TrackPlayer({title, name, image, size}: ItemProps) {
    return (
        <div>
            <h1>Track Player</h1>
            <TrackItem title={title} name={name} image={image} size={size} />
            <Button>Play</Button>
        </div>
    )
}