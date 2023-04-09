import { useState } from "react";

export function useBoolean(
    initialValue = false
): [boolean, { on(): void; off(): void }] {
    const [isOn, setOn] = useState(initialValue);

    const on = () => setOn(true);
    const off = () => {
        // Debounce
        setTimeout(() => setOn(false), 300);
    };

    return [isOn, { on, off }];
}
