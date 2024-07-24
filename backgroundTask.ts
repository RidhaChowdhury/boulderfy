import * as TaskManager from 'expo-task-manager';
import * as Notifications from 'expo-notifications';

const TASK_NAME = 'BACKGROUND_TIMER_TASK';

interface BackgroundTaskData {
  restTime: number;
}

TaskManager.defineTask(TASK_NAME, ({ data, error }) => {
  if (error) {
    console.error(error);
    return;
  }

  const { restTime } = data as BackgroundTaskData;

  if (restTime <= 0) {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Rest Time Over',
        body: "It's time to get back to your workout!",
      },
      trigger: null,
    });
  } else {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Rest Timer Running',
        body: `Rest timer will end in ${restTime} seconds.`,
      },
      trigger: { seconds: restTime },
    });
  }
});
