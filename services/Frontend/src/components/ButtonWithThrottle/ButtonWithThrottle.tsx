import { Button, ButtonSize, ButtonVariant } from "@/components/Button";
import { useCountdown } from "@/hooks/useCountdown.ts";

type ButtonWithThrottleProps = {
    label: (seconds: number) => string;
    onPress: () => void;
    throttle: number;
    isDisabled?: boolean;
    variant?: ButtonVariant;
    size?: ButtonSize;
};

export const ButtonWithThrottle = ({ label, onPress, throttle, isDisabled, variant, size }: ButtonWithThrottleProps) => {
    const [timer, setTimer] = useCountdown();

    const handleOnPress = () => {
        onPress();
        setTimer(throttle);
    };

    return (
        <Button variant={variant} size={size} isDisabled={isDisabled || timer > 0} onPress={handleOnPress}>
            {label(timer)}
        </Button>
    );
};
