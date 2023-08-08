let windowObjRef: Window | null = null;
let previousUrl: string = '';

export const openSignInWindow = (url: string) => {
  const name = 'Wait...';
  const strWindowFeatures =
    'toolbar=no, menubar=no, location=no, status=no, scrollbar=no, width=600, height=700, top=100, left=100';

  // Check if the window is closed or not defined
  if (windowObjRef === null || windowObjRef.closed) {
    // Open a new popup window
    windowObjRef = window.open(url, name, strWindowFeatures);
  } else if (previousUrl !== url) {
    // If the URL changed, open a new popup window and focus it
    windowObjRef = window.open(url, name, strWindowFeatures);
    windowObjRef!.focus();
  } else {
    // If the URL is the same, focus the existing popup window
    windowObjRef.focus();
  }

  // Update the previous URL
  previousUrl = url;

  // Focus the window (this might not work on all browsers due to security concerns)
  if (windowObjRef) {
    windowObjRef.focus();
  } else {
    console.error('Failed to open popup window.');
  }
};