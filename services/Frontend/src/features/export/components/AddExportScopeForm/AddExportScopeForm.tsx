import { useState } from "react";
import dayjs from "dayjs";

import styles from "./styles/AddExportScopeForm.module.scss";

import { Button } from "@/components/Button";
import { DateRangeFiltersGroup } from "@/components/DateRangeFiltersGroup";
import { Dropdown } from "@/components/Dropdown";
import { DataExportScope, DataExportScopeDomain } from "@/features/export/types/DataExport";
import { useTranslate } from "@/lib/i18n/hooks/useTranslate.ts";
import { DateRangePreset } from "@/types/DateRangePreset.ts";
import { ISODateStringRange } from "@/types/ISODateString";
import { getDateRange } from "@/utils/getDateRange.ts";

const AVAILABLE_DOMAINS: DataExportScopeDomain[] = ["entries", "goals"];
const DEFAULT_TIMEFRAME = getDateRange(DateRangePreset.PAST_MONTH);
const DEFAULT_DOMAIN = null;

type AddExportScopeFormProps = {
    scopes: DataExportScope[];
    onAddScope: (scope: DataExportScope) => void;
};

export const AddExportScopeForm = ({ scopes, onAddScope }: AddExportScopeFormProps) => {
    const t = useTranslate();

    const [selectedDomain, setSelectedDomain] = useState<DataExportScopeDomain | null>(DEFAULT_DOMAIN);
    const [selectedRange, setSelectedRange] = useState<ISODateStringRange>(DEFAULT_TIMEFRAME);

    const dropdownItems = AVAILABLE_DOMAINS.filter((availableDomain) => !scopes.find((scope) => scope.domain === availableDomain)).map(
        (domain) => ({
            key: domain,
            label: t(`exports.common.scope.domains.${domain}`),
        })
    );

    const resetFields = () => {
        setSelectedDomain(DEFAULT_DOMAIN);
        setSelectedRange(DEFAULT_TIMEFRAME);
    };

    const addScope = () => {
        if (!selectedDomain || !selectedRange) {
            return;
        }

        onAddScope({
            domain: selectedDomain,
            dateRange: {
                from: dayjs(selectedRange.from).startOf("day").toDate(),
                to: dayjs(selectedRange.to).endOf("day").toDate(),
            },
        });
        resetFields();
    };

    return (
        <form className={styles.form}>
            <Dropdown
                label={t("exports.start.modal.selectDomain")}
                placeholder={t("exports.start.modal.domainPlaceholder")}
                items={dropdownItems}
                selectedKey={selectedDomain}
                onChange={(key) => setSelectedDomain(key as DataExportScopeDomain)}
            />

            <DateRangeFiltersGroup dateRange={selectedRange} onDateRangeChange={setSelectedRange} />

            <Button onPress={addScope} isDisabled={!selectedDomain || !selectedRange}>
                {t("exports.start.modal.buttons.addScope.label")}
            </Button>
        </form>
    );
};
