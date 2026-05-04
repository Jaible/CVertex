import { cn } from "~/lib/utils";
import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
} from "../Accordion";

const getScoreStyles = (score: number) => {
    if (score > 69) {
        return {
            badge: "bg-emerald-500/15 border-emerald-500/20",
            text: "text-emerald-300",
            card: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
            icon: "/icons/check.svg",
        };
    }

    if (score > 39) {
        return {
            badge: "bg-yellow-500/15 border-yellow-500/20",
            text: "text-yellow-300",
            card: "bg-yellow-500/10 border-yellow-500/20 text-yellow-200",
            icon: "/icons/warning.svg",
        };
    }

    return {
        badge: "bg-red-500/15 border-red-500/20",
        text: "text-red-300",
        card: "bg-red-500/10 border-red-500/20 text-red-200",
        icon: "/icons/warning.svg",
    };
};

const getTipStyles = (type: "good" | "improve") => {
    return type === "good"
        ? {
            card: "bg-emerald-500/10 border-emerald-500/20 text-emerald-200",
            icon: "/icons/check.svg",
        }
        : {
            card: "bg-yellow-500/10 border-yellow-500/20 text-yellow-200",
            icon: "/icons/warning.svg",
        };
};

const ScoreBadge = ({ score }: { score: number }) => {
    const styles = getScoreStyles(score);

    return (
        <div
            className={cn(
                "flex flex-row gap-1 items-center px-3 py-1 rounded-full border backdrop-blur-md",
                styles.badge
            )}
        >
            <img
                src={styles.icon}
                alt="score"
                className="size-4"
            />

            <p className={cn("text-sm font-semibold", styles.text)}>
                {score}/100
            </p>
        </div>
    );
};

const CategoryHeader = ({
                            title,
                            categoryScore,
                        }: {
    title: string;
    categoryScore: number;
}) => {
    return (
        <div className="flex flex-row gap-4 items-center py-2">
            <p className="text-2xl font-semibold text-zinc-100">
                {title}
            </p>

            <ScoreBadge score={categoryScore} />
        </div>
    );
};

const CategoryContent = ({
                             tips,
                         }: {
    tips: { type: "good" | "improve"; tip: string; explanation: string }[];
}) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl w-full rounded-2xl px-5 py-4 grid grid-cols-2 max-md:grid-cols-1 gap-4">
                {tips.map((tip, index) => {
                    const styles = getTipStyles(tip.type);

                    return (
                        <div
                            className="flex flex-row gap-2 items-center"
                            key={index}
                        >
                            <img
                                src={styles.icon}
                                alt="score"
                                className="size-5 shrink-0"
                            />

                            <p className="text-lg text-zinc-300">
                                {tip.tip}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="flex flex-col gap-4 w-full">
                {tips.map((tip, index) => {
                    const styles = getTipStyles(tip.type);

                    return (
                        <div
                            key={`${index}-${tip.tip}`}
                            className={cn(
                                "flex flex-col gap-2 rounded-2xl p-5 border backdrop-blur-xl",
                                styles.card
                            )}
                        >
                            <div className="flex flex-row gap-2 items-center">
                                <img
                                    src={styles.icon}
                                    alt="score"
                                    className="size-5 shrink-0"
                                />

                                <p className="text-xl font-semibold">
                                    {tip.tip}
                                </p>
                            </div>

                            <p className="text-sm leading-relaxed opacity-80">
                                {tip.explanation}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const categories = [
    {
        id: "tone-style",
        title: "Tone & Style",
        data: "toneAndStyle",
    },
    {
        id: "content",
        title: "Content",
        data: "content",
    },
    {
        id: "structure",
        title: "Structure",
        data: "structure",
    },
    {
        id: "skills",
        title: "Skills",
        data: "skills",
    },
] as const;

const Details = ({ feedback }: { feedback: Feedback }) => {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Accordion>
                {categories.map((category) => {
                    const section = feedback[category.data];

                    return (
                        <AccordionItem
                            key={category.id}
                            id={category.id}
                        >
                            <AccordionHeader itemId={category.id}>
                                <CategoryHeader
                                    title={category.title}
                                    categoryScore={section.score}
                                />
                            </AccordionHeader>

                            <AccordionContent itemId={category.id}>
                                <CategoryContent tips={section.tips} />
                            </AccordionContent>
                        </AccordionItem>
                    );
                })}
            </Accordion>
        </div>
    );
};

export default Details;