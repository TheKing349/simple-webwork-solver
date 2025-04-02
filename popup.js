import { fetchAPI, processPath, formatAnswers } from "./utils/helpers.js";
import { apiUrl } from "./utils/envs.js";
import { initTheme } from "./utils/theme.js";
import { initCopy } from "./utils/copy.js";

document.addEventListener("DOMContentLoaded", async () => {
  initTheme();
  initCopy();

  const resultDiv = document.getElementById("result");
  const debugInfoDiv = document.getElementById("debugInfo");

  try {
    const [tab] = await chrome.tabs.query({
      active: true,
      currentWindow: true,
    });
    const injectionResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        problemPath: document.querySelector('input[name="problemPath"]')?.value,
        randomSeed: document.querySelector('input[name="randomSeed"]')?.value,
      }),
    });
    let { problemPath, randomSeed } = injectionResult[0].result;

    if (problemPath == undefined || randomSeed == undefined) {
      resultDiv.innerHTML = `<div>Could not find path or seed. Ensure you are on a WeBWorK-compatible website.</div>`;
      return;
    }
    problemPath = processPath(problemPath);

    debugInfoDiv.innerHTML = `path: <span>${problemPath}</span><br>seed: <span>${randomSeed}</span>`;
    const debugInfoBtn = document.getElementById("debugInfoBtn");
    let isActive = false;

    debugInfoBtn.addEventListener("click", () => {
      isActive = !isActive;
      const debugInfo = document.getElementById("debugInfo");
      debugInfo.style.display = isActive ? "block" : "none";
      debugInfoBtn.innerText = isActive ? "Hide Debug Info" : "Show Debug Info";
    });

    const viewProblemBtn = document.getElementById("viewProblem");
    viewProblemBtn.style.display = "block";

    viewProblemBtn.addEventListener("click", () => {
      apiUrl.searchParams.delete("format");
      apiUrl.searchParams.append("format", "html");

      chrome.tabs.create({ url: apiUrl.toString() });
    });

    apiUrl.searchParams.append("problemSeed", randomSeed);
    apiUrl.searchParams.append("sourceFilePath", problemPath);
    apiUrl.searchParams.append("displayMode", "MathJax");
    apiUrl.searchParams.append("showSolutions", "1");
    apiUrl.searchParams.append("format", "json");

    const data = await fetchAPI(apiUrl);

    if (data.flags.error_flag === 1) {
      resultDiv.innerHTML = `
        <div>Could not load results. This could be due to a broken .pg file.</div>
      `;
      return;
    }

    resultDiv.innerHTML = `
      ${formatAnswers(data.answers)}
    `;
  } catch (error) {
    resultDiv.innerHTML = `<div>${error.message}</div>`;
  }
});