export function isBackgroundColorNotWhiteOrTransparent(stylesArray: unknown[]) {
    for (const style of stylesArray) {
        if (
            style &&
            typeof style === "object" &&
            Object.hasOwnProperty.call(style, "backgroundColor")
        ) {
            const color = (style as { backgroundColor: unknown })
                .backgroundColor;
            if (
                color !== "white" &&
                color !== "#fff" &&
                color !== "#ffffff" &&
                color !== "transparent" &&
                color !== "rgba(0,0,0,0)"
            ) {
                return true;
            }
        }
    }
    return false;
}
