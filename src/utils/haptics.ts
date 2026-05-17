import ReactNativeHapticFeedback, {
  HapticFeedbackTypes,
} from 'react-native-haptic-feedback';
import { Platform } from 'react-native';

const options = {
  enableVibrateFallback: true,
  ignoreAndroidSystemSettings: false,
};

/**
 * Light tap — for icon toggles, chips, tab switches
 */
export const hapticLight = () => {
  ReactNativeHapticFeedback.trigger(
    Platform.OS === 'ios'
      ? HapticFeedbackTypes.impactLight
      : HapticFeedbackTypes.soft,
    options,
  );
};

/**
 * Medium — for primary button presses, card taps
 */
export const hapticMedium = () => {
  ReactNativeHapticFeedback.trigger(
    Platform.OS === 'ios'
      ? HapticFeedbackTypes.impactMedium
      : HapticFeedbackTypes.impactMedium,
    options,
  );
};

/**
 * Heavy — for confirmations, form submissions, destructive actions
 */
export const hapticHeavy = () => {
  ReactNativeHapticFeedback.trigger(
    Platform.OS === 'ios'
      ? HapticFeedbackTypes.impactHeavy
      : HapticFeedbackTypes.impactHeavy,
    options,
  );
};

/**
 * Success — for completed actions (quote sent, added to favorites)
 */
export const hapticSuccess = () => {
  ReactNativeHapticFeedback.trigger(
    Platform.OS === 'ios'
      ? HapticFeedbackTypes.notificationSuccess
      : HapticFeedbackTypes.notificationSuccess,
    options,
  );
};

/**
 * Error — for validation failures, errors
 */
export const hapticError = () => {
  ReactNativeHapticFeedback.trigger(
    Platform.OS === 'ios'
      ? HapticFeedbackTypes.notificationError
      : HapticFeedbackTypes.notificationError,
    options,
  );
};

/**
 * Selection changed — for toggling items in a list/tab
 */
export const hapticSelection = () => {
  ReactNativeHapticFeedback.trigger(
    HapticFeedbackTypes.selection,
    options,
  );
};
