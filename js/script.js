"use strict";

const launchButton = document.querySelector("#launch-button");
const resetButton = document.querySelector("#reset-button");
const failCheckbox = document.querySelector("#fail-checkbox");
const secondsText = document.querySelector("#seconds");
const status = document.querySelector("#status");
const result = document.querySelector("#result");
const stages = ["countdown", "systems", "permission"];
let seconds = 5;
let intervalId = null;

function setStage(name, state) {
  document.querySelector(`#stage-${name}`).className = `step-card is-${state}`;
}
function resetStages() {
  stages.forEach(
    (name) =>
      (document.querySelector(`#stage-${name}`).className = "step-card"),
  );
}

// TODO 1. Каждые 650 мс уменьшайте seconds через setInterval.
// Когда seconds станет 0, вызовите clearInterval и onDone().
function startCountdown(onDone) {
  intervalId = setInterval(() => {
    seconds -= 1;
    secondsText.textContent = seconds;
    if (seconds === 0) {
      clearInterval(intervalId);
      intervalId = null;
      onDone();
    };
  }, 650);
}

// TODO 2. Через 800 мс завершите проверку систем и вызовите onDone().
function checkSystems(onDone) {
  setTimeout(() => onDone(), 800);
}

// TODO 3. Верните Promise с задержкой 900 мс.
// Если shouldFail = true, вызовите reject(new Error(...)), иначе resolve(...).
function requestPermission(shouldFail) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (shouldFail) reject(new Error("Разрешение на запуск не получено, вам низя это запускать"));
      else resolve("О, ты из наших. Разрешение получено");
    }, 900);
  });
}

// TODO 4. Дополните готовую async-функцию, которая последовательно:
// а) ждёт отсчёт, обернув callback в Promise;
// б) ждёт проверку систем, обернув callback в Promise;
// в) ждёт requestPermission через await;
// г) показывает успех или ошибку через try/catch;
// д) возвращает кнопки в исходное состояние через finally.
async function launchMission() {
  if (launchButton.disabled) return;
  launchButton.disabled = true;
  resetButton.disabled = true;
  resetStages();
  seconds = 5;
  secondsText.textContent = seconds;
  result.textContent = "Подготовка...";
  status.className = "status status--working";

  try {
    setStage("countdown", "active");
    status.textContent = "Идёт отсчёт...";
    await new Promise((resolve) => startCountdown(resolve));
    setStage("countdown", "done");
    setStage("systems", "active");
    status.textContent = "Проверка систем...";
    // TODO 4а. Дождитесь startCountdown, обернув callback в Promise.
    // TODO 4б. Дождитесь checkSystems, обернув callback в Promise.
    await new Promise((resolve) => checkSystems(resolve));
    setStage("systems", "done");
    setStage("permission", "active");
    status.textContent = "Запрос разрешения у Чонгука Романовича...";
    // TODO 4в. Дождитесь requestPermission через await.
    // Сохраните ответ в переменную answer.
    const answer = await requestPermission(failCheckbox.checked);

    setStage("permission", "done");
    result.textContent = "Миссия запущена!";
    status.className = "status status--success";
    status.textContent = answer;
    // TODO 4г. Выведите полученный ответ в status.textContent.
  } catch (error) {
    result.textContent = "Запуск отменён";
    status.className = "status status--error";
    status.textContent = error.message;
  } finally {
    launchButton.disabled = false;
    resetButton.disabled = false;
  }
}

launchButton.addEventListener("click", launchMission);
resetButton.addEventListener("click", () => {
  if (launchButton.disabled) return; // во время запуска сброс недоступен
  clearInterval(intervalId);
  intervalId = null;
  seconds = 5;
  secondsText.textContent = seconds;
  resetStages();
  status.className = "status";
  status.textContent = "Миссия готова.";
  result.textContent = "Ожидание запуска";
});
