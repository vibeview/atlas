/** Remote-button events from useTVEventHandler. It also reports focus and blur on tvOS; those are not presses. */
const PRESSES = new Set(['up', 'down', 'left', 'right', 'select']);

export function isPress(eventType: string | undefined): boolean {
  return eventType !== undefined && PRESSES.has(eventType);
}
