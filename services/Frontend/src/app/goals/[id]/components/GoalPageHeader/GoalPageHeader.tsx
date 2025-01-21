import { AppRoute } from "@/app/appRoute";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate";

type GoalPageHeaderProps = {
    goalName: string;
};

export const GoalPageHeader = ({ goalName }: GoalPageHeaderProps) => {
    const t = useTranslate();

    return (
        <Breadcrumbs
            items={[
                {
                    label: t("goal.navigation.goals.label"),
                    href: AppRoute.GOALS,
                },
                { label: goalName },
            ]}
        />
    );
};
