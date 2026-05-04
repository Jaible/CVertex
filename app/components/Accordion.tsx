import type { ReactNode } from "react";
import { createContext, useContext, useState } from "react";

import { cn } from "~/lib/utils";

interface AccordionContextType {
    activeItems: string[];
    toggleItem: (id: string) => void;
    isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<
    AccordionContextType | undefined
>(undefined);

const useAccordion = () => {
    const context = useContext(AccordionContext);

    if (!context) {
        throw new Error(
            "Accordion components must be used within an Accordion"
        );
    }

    return context;
};

interface AccordionProps {
    children: ReactNode;
    defaultOpen?: string;
    allowMultiple?: boolean;
    className?: string;
}

export const Accordion = ({
                              children,
                              defaultOpen,
                              allowMultiple = false,
                              className,
                          }: AccordionProps) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : []
    );

    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            const isActive = prev.includes(id);

            if (allowMultiple) {
                return isActive
                    ? prev.filter((item) => item !== id)
                    : [...prev, id];
            }

            return isActive ? [] : [id];
        });
    };

    const isItemActive = (id: string) =>
        activeItems.includes(id);

    return (
        <AccordionContext.Provider
            value={{
                activeItems,
                toggleItem,
                isItemActive,
            }}
        >
            <div className={cn("space-y-2", className)}>
                {children}
            </div>
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export const AccordionItem = ({
                                  children,
                                  className,
                              }: AccordionItemProps) => {
    return (
        <div
            className={cn(
                "overflow-hidden border-b border-zinc-800 bg-zinc-900/30 backdrop-blur-xl",
                className
            )}
        >
            {children}
        </div>
    );
};

interface AccordionHeaderProps {
    itemId: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

export const AccordionHeader = ({
                                    itemId,
                                    children,
                                    className,
                                    icon,
                                    iconPosition = "right",
                                }: AccordionHeaderProps) => {
    const { toggleItem, isItemActive } = useAccordion();

    const isActive = isItemActive(itemId);

    const defaultIcon = (
        <svg
            className={cn(
                "size-5 text-zinc-400 transition-transform duration-200 dark:text-zinc-500",
                {
                    "rotate-180": isActive,
                }
            )}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
            />
        </svg>
    );

    return (
        <button
            type="button"
            onClick={() => toggleItem(itemId)}
            className={cn(
                "flex w-full items-center justify-between px-4 py-3 text-left transition-colors duration-200 cursor-pointer",
                className
            )}
        >
            <div className="flex items-center gap-3">
                {iconPosition === "left" &&
                    (icon || defaultIcon)}

                <div className="flex-1">
                    {children}
                </div>
            </div>

            {iconPosition === "right" &&
                (icon || defaultIcon)}
        </button>
    );
};

interface AccordionContentProps {
    itemId: string;
    children: ReactNode;
    className?: string;
}

export const AccordionContent = ({
                                     itemId,
                                     children,
                                     className,
                                 }: AccordionContentProps) => {
    const { isItemActive } = useAccordion();

    const isActive = isItemActive(itemId);

    return (
        <div
            className={cn(
                "overflow-hidden transition-all duration-300 ease-in-out",
                isActive
                    ? "max-h-[1000px] opacity-100"
                    : "max-h-0 opacity-0",
                className
            )}
        >
            <div className="px-4 py-3">
                {children}
            </div>
        </div>
    );
};