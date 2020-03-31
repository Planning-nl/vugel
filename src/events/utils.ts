export function getTargetOffset(e: EventWithCoordinates): { x: number; y: number } {
    const target = e.target as HTMLElement;
    if (!target) return { x: 0, y: 0 };
    const rect = target.getBoundingClientRect();
    return { x: e.pageX - rect.left, y: e.pageY - rect.top };
}

type EventWithCoordinates = { pageX: number; pageY: number; target: EventTarget | null };
