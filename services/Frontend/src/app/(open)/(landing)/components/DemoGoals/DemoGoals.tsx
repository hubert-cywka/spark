import { GoalCard } from "@/features/goals/components/GoalCard";
import { Goal } from "@/features/goals/types/Goal";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";

const createdAt = new Date("Fri, 01 Jun 2025 15:55:00 GMT");
const deadline = new Date("Fri, 01 Jun 2035 15:55:00 GMT");

export const DemoGoals = () => {
    const t = useTranslate();

    const mockGoal: Goal = {
        isAccomplished: false,
        createdAt,
        id: "1",
        name: t("landingPage.demo.goals.mocks.1.name"),
        isExpired: false,
        deadline,
        target: 5,
        targetProgress: 3,
    };

    const completedMockGoal: Goal = {
        isAccomplished: true,
        createdAt,
        id: "2",
        name: t("landingPage.demo.goals.mocks.2.name"),
        isExpired: false,
        deadline: null,
        target: 9,
        targetProgress: 9,
    };

    return (
        <>
            <GoalCard goal={mockGoal} />
            <GoalCard goal={completedMockGoal} />
        </>
    );
};
