/**
 * Creates a timer that counts the number of seconds and updates the provided element with the current count.
 *
 * @param {Element} element - The element to update with the current count.
 * @param {function} callback - The callback function to execute when the timer reaches 999 seconds.
 * @return {object} An object with two methods: start and stop.
 */
const createTimer = (element, callback) => {
  let timerId;
  let seconds = 0;

  /**
   * Stops the execution of the timer.
   */
  const stop = () => {
    clearInterval(timerId);
  };

  const timerContainer = createNumberContainer(0);

  element.appendChild(timerContainer);
  const timer = () => {
    if (seconds >= 999) {
      stop();
      callback();
    }

    renderNumber(timerContainer, seconds);
    // element.innerText = seconds.toString().padStart(3, "0");
    seconds += 1;
  };

  /**
   * Starts the timer and sets an interval to call the timer function every second.
   */
  const start = () => {
    timer();
    timerId = setInterval(timer, 1000);
  };

  // element.innerText = "000";

  return {
    start,
    stop,
  };
};
