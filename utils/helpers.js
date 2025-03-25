export const processPath = (path) => {
  const index = path.indexOf("Library");
  let processedPath = index !== -1 ? path.substring(index) : path;
  return removeNumberSuffix(processedPath);
};

function removeNumberSuffix(str) {
  return str.replace(/-(\d+)\.pg$/, '.pg');
}

export const fetchAPI = async (url) => {
  try {
    const response = await fetch(url);
    return await response.json();
  } catch (error) {
    throw new Error(`API request failed: ${error.message}`);
  }
};

export const formatAnswers = (answers) => {
  if (!answers) return "No answers found";

  return Object.entries(answers)
    .map(
      ([_, data]) => `
        <div>
          <h3><strong>Answer:</strong> 
            <span>${data.correct_ans || "N/A"}</span>
          </h3>
        </div>
      `
    )
    .join("");
};