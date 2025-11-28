"use client"

import { useX402Fetch } from "@privy-io/react-auth";
import { Button } from "@/components/ui/button";

/** The pay component props */
export interface PayProps {
    /** The URL to fetch */
    url: string;
    /** The action label to perform */
    action: string;
    /** The amount to pay */
    maxValue: bigint;
}

export default function XPay({ url, action, maxValue }: PayProps) {
    const {wrapFetchWithPayment} = useX402Fetch();

    /** Fetch the premium content */
    async function fetchPremiumContent() {
        const fetchWithPayment = wrapFetchWithPayment({fetch, maxValue});

        const response = await fetchWithPayment(url);
        const data = await response.json();

        return data;
    }
    
    return <Button onClick={fetchPremiumContent}>{action}</Button>;
}