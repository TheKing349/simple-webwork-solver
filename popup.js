import { fetchAPI, processPath, formatAnswers } from './utils/helpers.js';
import { apiUrl } from './utils/envs.js';

document.addEventListener('DOMContentLoaded', async () => {
  const resultDiv = document.getElementById('result');
  
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const injectionResult = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => ({
        problemPath: document.querySelector('input[name="problemPath"]')?.value,
        randomSeed: document.querySelector('input[name="randomSeed"]')?.value
      })
    });

    let { problemPath, randomSeed } = injectionResult[0].result;
    problemPath = processPath(problemPath);

    apiUrl.searchParams.append('problemSeed', randomSeed);
    apiUrl.searchParams.append('sourceFilePath', problemPath);
    apiUrl.searchParams.append('showSolutions', '1');
    apiUrl.searchParams.append('format', 'json');

    const data = await fetchAPI(apiUrl);
    
    resultDiv.innerHTML = `
      ${formatAnswers(data.answers)}
    `;
    
    const viewProblemBtn = document.getElementById('viewProblem');
    viewProblemBtn.style.display = 'block';

    viewProblemBtn.addEventListener('click', () => {
      apiUrl.searchParams.delete('format');
      apiUrl.searchParams.append('format', 'html');

      chrome.tabs.create({ url: apiUrl.toString() });
    });
  } catch (error) {
    resultDiv.innerHTML = `<div class="error">${error.message}</div>`;
  }
});