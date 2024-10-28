export type FormProps<T> = {
    onSubmit: (data: T) => void;
    isLoading?: boolean;
    isDisabled?: boolean;
};
