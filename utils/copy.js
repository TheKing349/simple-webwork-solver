document.addEventListener('click', (event) => {
  if (event.target.tagName === 'SPAN') {
    copyToClipboard(event.target);
  }
});

function copyToClipboard(spanElement) {
  const text = spanElement.textContent;
  navigator.clipboard.writeText(text)
    .then(() => {
      showFeedback(spanElement);
    })
    .catch(err => console.error('Failed to copy:', err));
}

function showFeedback(element) {
  element.classList.add('copied');
  setTimeout(() => element.classList.remove('copied'), 2000);
}