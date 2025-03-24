export const processPath = (path) => {
  const parts = path.split("/");

  if (parts.length > 0) {
    let filename = parts.pop();
    const lastDotIndex = filename.lastIndexOf(".");
    if (lastDotIndex !== -1) {
      const name = filename.substring(0, lastDotIndex).replace(/-\d+$/, "");
      const extension = filename.substring(lastDotIndex + 1);
      filename = name + "." + extension;
    } else {
      filename = filename.replace(/-\d+$/, "");
    }
    parts.push(filename);
  }

  if (parts[0] === "local" || parts[0] === "UNL-Problems") {
    parts.shift();
  }

  return parts.join("/");
};

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