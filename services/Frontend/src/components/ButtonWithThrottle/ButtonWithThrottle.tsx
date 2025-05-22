import { Button, ButtonSize, ButtonVariant } from "@/components/Button";
import { useCountdown } from "@/hooks/useCountdown.ts";

type ButtonWithThrottleProps = {
    label: (seconds: number) => string;
    onPress?: () => void;
    throttle: number;
    isDisabled?: boolean;
    variant?: ButtonVariant;
    type?: "button" | "submit" | "reset";
    size?: ButtonSize;
};

export const ButtonWithThrottle = ({ label, onPress, throttle, isDisabled, variant, size, type }: ButtonWithThrottleProps) => {
    const [timer, setTimer] = useCountdown();

    const handleOnPress = () => {
        onPress?.();
        setTimer(throttle);
    };

    return (
        <Button variant={variant} size={size} isDisabled={isDisabled || timer > 0} onPress={handleOnPress} type={type}>
            {label(timer)}
        </Button>
    );
};
