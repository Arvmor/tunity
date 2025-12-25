import Link from "next/link";

export interface HeaderLinkProps {
    label: string;
    href?: string;
}

const headerLinks: HeaderLinkProps[] = [
    {
        label: "Integration",
    },
    {
        label: "Pricing",
    },
    {
        label: "API Docs",
    },
];

export default function AppHeader() {
    const links = headerLinks.map(({ label, href }, index) => (
        <Link key={index} href={href ?? "#"} className="text-sm text-muted-foreground">
            {label}
        </Link>
    ));

    return (
        <div className="flex justify-between items-center">
            <h1>App Header</h1>

            <div className="flex items-center gap-4">{links}</div>
        </div>
    );
}
