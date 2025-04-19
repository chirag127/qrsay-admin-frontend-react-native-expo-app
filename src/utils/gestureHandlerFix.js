/**
 * This file provides fallback implementations for missing functions in react-native-gesture-handler
 * to prevent import errors and crashes.
 */

// Fallback implementation for getReactNativeVersion
export function getReactNativeVersion() {
  return { major: 0, minor: 76 };
}

// Fallback implementation for baseGestureHandlerWithMonitorProps
export const baseGestureHandlerWithMonitorProps = {
  id: 'gesture-handler-id',
  enabled: true,
  shouldCancelWhenOutside: true,
  hitSlop: undefined,
  cancelsTouchesInView: true,
  waitFor: undefined,
  simultaneousHandlers: undefined,
  needsPointerData: false,
  manualActivation: false,
  activateAfterLongPress: undefined,
  onBegan: undefined,
  onActivated: undefined,
  onFailed: undefined,
  onCancelled: undefined,
  onEnded: undefined,
  onGestureEvent: undefined,
  onHandlerStateChange: undefined,
};

// Fallback implementation for handlersRegistry
export const handlersRegistry = {
  getHandler: () => null,
  createHandler: () => null,
  attachHandlerToView: () => null,
  dropHandler: () => null,
  dropAllHandlers: () => null,
};
