import CallToAction, { CallToActionProps } from "@/components/platform/callToAction";
import Optionable, { OptionableProps } from "@/components/platform/optionable";
import Paragraph, { ParagraphProps } from "@/components/platform/paragraph";
import { Separator } from "@/components/ui/separator";
import { Building2 } from "lucide-react";

const paragraph: ParagraphProps = {
    title: "Integration Instructions",
    text: "Select your preferred data storage provider above.Follow the step-by-step xByte instructions to configure access policies and permissions on AWS, GCP, Azure, or xByte Hosting.Ensure credentials are entered securely. After setup, click the Verify button below to confirm xByte's access.If verification succeeds, you will progress to wallet setup.",
};

const integrationOptions: OptionableProps[] = [
    {
        titleText: "AWS",
        descriptionText: "Connect Amazon",
        Icon: Building2,
    },
    {
        titleText: "GCP",
        descriptionText: "Connect Google Cloud",
        Icon: Building2,
    },
    {
        titleText: "Azure",
        descriptionText: "Connect Azure",
        Icon: Building2,
    },
];

const setContentPricing: CallToActionProps = {
    titleText: "Set Content Pricing.",
    descriptionText: "Choose API or set manually. Flexible tiers for all.",
    buttonText: "Get Started",
};

const verifySection: CallToActionProps = {
    titleText: "Ready to verify?",
    buttonText: "Verify",
};

const heroSection: CallToActionProps = {
    titleText: "Integrate xByte-SDK.",
    descriptionText: "Get your API key and add xByte to your platform.",
    buttonText: "Get API Key",
    secondaryButtonText: "Documentation",
};

export default function Home() {
    return (
        <div>
            {/* Start Integrating */}
            <CallToAction {...heroSection} />

            {/* Integration Options */}
            <div className="flex flex-col md:flex-row gap-4 py-18">
                {integrationOptions.map((option) => (
                    <Optionable key={option.titleText} {...option} />
                ))}
            </div>

            <Paragraph {...paragraph} />

            <Separator className="my-16" />

            {/* Verify Integration */}
            <CallToAction {...verifySection} />

            {/* Get Started */}
            <CallToAction {...setContentPricing} />
        </div>
    );
}
