import { fetchAPI, processPath, formatAnswers } from "./utils/helpers.js";
import { apiUrl } from "./utils/envs.js";

document.addEventListener("DOMContentLoaded", async () => {
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

    debugInfoDiv.innerHTML = `<span>path: ${problemPath}<br>seed: ${randomSeed}</span>`;
    const debugInfoBtn = document.getElementById("debugInfoBtn");
    let isActive = false;

    debugInfoBtn.addEventListener("click", () => {
      isActive = !isActive;
      const debugInfo = document.getElementById("debugInfo");
      debugInfo.style.display = isActive ? "block" : "none";
      debugInfoBtn.innerText = isActive ? "Hide Debug Info" : "Show Debug Info";
    });

    apiUrl.searchParams.append("problemSeed", randomSeed);
    apiUrl.searchParams.append("sourceFilePath", problemPath);
    apiUrl.searchParams.append("showSolutions", "1");
    apiUrl.searchParams.append("format", "json");

    const data = await fetchAPI(apiUrl);

    resultDiv.innerHTML = `
      ${formatAnswers(data.answers)}
    `;

    document.querySelectorAll(".answer-text").forEach((button) => {
      button.addEventListener("click", async (e) => {
        const answer = e.target.innerText;

        try {
          await navigator.clipboard.writeText(answer);
        } catch (err) {
          console.error("Copy failed:", err);
        }

        setTimeout(() => {
          feedback.textContent = "";
        }, 2000);
      });
    });

    const viewProblemBtn = document.getElementById("viewProblem");
    viewProblemBtn.style.display = "block";

    viewProblemBtn.addEventListener("click", () => {
      apiUrl.searchParams.delete("format");
      apiUrl.searchParams.append("format", "html");

      chrome.tabs.create({ url: apiUrl.toString() });
    });
  } catch (error) {
    resultDiv.innerHTML = `<div>${error.message}</div>`;
  }
});
