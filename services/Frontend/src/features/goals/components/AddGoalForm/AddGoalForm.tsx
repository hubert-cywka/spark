import { Field, NumberInput } from "@/components/Input";
import { useAddGoalForm } from "@/features/goals/components/AddGoalForm/hooks/useAddGoalForm";

export const AddGoalForm = () => {
    const { control } = useAddGoalForm();

    return (
        <form>
            <Field name="name" control={control} label="Name" />
            <NumberInput name="target" control={control} label="Target" minValue={1} defaultValue={10} />
        </form>
    );
};
