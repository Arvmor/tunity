"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

/**
 * The steps of the setup process.
 */
enum SetupStep {
    Onboarding,
    SetupProvider,
    SetWallet,
    SetPrice,
    SetSDK,
    Onboarded,
}

/**
 * The next step for each step.
 */
const nextStep = new Map<SetupStep, SetupStep>([
    [SetupStep.Onboarding, SetupStep.SetupProvider],
    [SetupStep.SetupProvider, SetupStep.SetWallet],
    [SetupStep.SetWallet, SetupStep.SetPrice],
    [SetupStep.SetPrice, SetupStep.SetSDK],
    [SetupStep.SetSDK, SetupStep.Onboarded],
    [SetupStep.Onboarded, SetupStep.Onboarded],
]);

/**
 * The section for each step.
 */
const stepSection = new Map<SetupStep, React.ReactNode>([
    [SetupStep.Onboarding, <OnboardingSection />],
    [SetupStep.SetupProvider, <IntegrateProviderSection />],
    [SetupStep.SetWallet, <SetWalletSection />],
    [SetupStep.SetPrice, <SetPriceSection />],
    [SetupStep.SetSDK, <SetSDKSection />],
    [SetupStep.Onboarded, <OnboardedSection />],
]);

export default function SetupPage() {
    const [step, setStep] = useState<SetupStep>(SetupStep.Onboarding);

    const StepSection = stepSection.get(step);
    if (!StepSection) {
        return <div>Step not found</div>;
    }

    const handleNextStep = () => {
        const next = nextStep.get(step) ?? SetupStep.Onboarding;
        setStep(next);
    };

    return (
        <div>
            {StepSection}
            <Button onClick={handleNextStep}>Next</Button>
        </div>
    );
}

function OnboardingSection() {
    return <>Integrate xByte with your platform.</>;
}

function IntegrateProviderSection() {
    return (
        <div>
            <h1>Integrate Data Provider</h1>
        </div>
    );
}

function SetWalletSection() {
    return (
        <div>
            <h1>Set Wallet</h1>
            <Input placeholder="e.g. 0xYourAddress" />
        </div>
    );
}

function SetPriceSection() {
    return (
        <div>
            <h1>Set Price</h1>
        </div>
    );
}

function SetSDKSection() {
    return (
        <div>
            <h1>Set SDK</h1>
        </div>
    );
}

function OnboardedSection() {
    return (
        <div>
            <h1>Onboarded</h1>
        </div>
    );
}
