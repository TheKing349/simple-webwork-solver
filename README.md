# WeBWorK Solution Explorer 

**A Chrome Extension for Answer Extraction & Solution Walkthrough**  

*Disclaimer: This tool is intended for educational purposes only. Users are responsible for adhering to their institution's academic integrity policies. We do not condone unethical use of this extension.*

## Key Features
- **Automated Answer Extraction**: Retrieves verified answers directly from WeBWorK problems
- **Step-by-Step Solutions**: Displays detailed solution pathways to enhance understanding
- **Open-Source Integration**: Leverages the official [WeBWorK OpenProblemLibrary](https://github.com/openwebwork/webwork-open-problem-library/tree/main/OpenProblemLibrary)

## Technical Overview
The extension identifies unique problem identifiers (path/seed) from your WeBWorK assignment and communicates with a WeBWorK Renderer API. By analyzing the returned JSON data structure, it extracts both final answers and solution methodologies.

*Required Infrastructure:*  
- [WeBWorK Renderer](https://github.com/openwebwork/renderer) API endpoint (self-hosted)

## Installation Guide

### 1. Obtain Extension Files
**Option A - Clone Repository**
```bash
git clone https://github.com/TheKing349/simple-webwork-solver.git
```
Option B - Download ZIP
[Download Latest Release](https://github.com/TheKing349/simple-webwork-solver/archive/refs/heads/main.zip)

### 2. Configure Renderer API
1. Deploy the WeBWorK Renderer following [official documentation](https://github.com/openwebwork/renderer)
2. Ensure public internet accessibility
3. Configure [renderer-api.conf](https://github.com/openwebwork/renderer/blob/main/render_app.conf.dist)(add a mount for this if using docker):
```conf
...
SITE_HOST = 'your_public_url_here'
CORS_ORIGIN = '*' # Keep this setting
...
```

### 3. Extension Configuration
1. Update API endpoints in:
	- `manifest.json`
	- `utils/envs.js`
	Replace `[URL_HERE]` with your renderer URL(e.g., `your-renderer-domain.com:3000`). Preserve the `/render-api` path on `utils/envs.js`

### 4. Chrome Installation
1. Navigate to `chrome://extension`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load Unpacked** and select the extension directory

## Usage Instructions
1. Navigate to any WeBWorK assignment page
2. Click the extension icon to activate
3. Select between:
	- **Instant Answer** (Direct result)
	- **Solution Walkthrough** (step-by-step process)

## Contributions Welcome
We actively encourage community participation in developing this open-source tool. Meaningful contributions come in many forms:
- **Issue Reporting**: Found a bug? [Create an issue](https://github.com/TheKing349/simple-webwork-solver/issues/new/choose) with detailed reproduction steps
- **Feature Proposals**: Have an improvement idea? Start a GitHub discussion first
- **Documentation**: Help improve documentation clarity or translate materials
- **Code Contributions**: Submit pull requests for bug fixes or approved features

## Support & Troubleshooting
Ensure your renderer instance is properly exposed to the internet and CORS policies are configured. For issues, verify:
- Renderer API responsiveness
- Correct URL configuration in extension files
- Active developer mode in Chrome

*Report technical issues via [GitHub Issues](https://github.com/TheKing349/simple-webwork-solver/issues)*