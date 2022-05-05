(() => {
  window.dringtech = {};

  // Function to register a resize notifier
  const registerResizeNotifier = () => {
    // Don't do this for top-level pages
    if (self === parent) return;
    // Print out a friendly message
    console.log('Registering Resize Notifier', location);
    // function to send resize message to parent
    function sendResizeMessage() {
      // Get the height of the document root element
      const height = document.documentElement
        .getBoundingClientRect().height;
      // Send a message to the parent containing the new height
      parent.postMessage({ height }, parent.location);
    }
    // Send an event, to set initial size
    sendResizeMessage();
    // Register the event sender
    addEventListener('resize', sendResizeMessage);
  };
  // Try to register the resize notifier
  addEventListener('DOMContentLoaded', registerResizeNotifier);

  window.dringtech.resizeListenerFactory = (id, allowedOrigins) => {
    // Print out a friendly message
    console.log('Creating Resize Listener', location);

    // Grab a reference to the iframe
    const iframe = document.getElementById(id);

    // Define a function to check if an event is valid
    const canProceeed = (event) =>
      typeof event.data.height === 'number' &&
      event.source === iframe.contentWindow &&
      (allowedOrigins === undefined || allowedOrigins.includes(event.origin))

    // Register an message listener
    addEventListener('message', (event) => {
      // Check that this is an expected message
      if (!canProceeed(event)) {
        // If not, print out a warning
        console.warn('Received message from unexpected source');
        return;
      };
      // Extract the height from the message
      const height = event.data.height;
      // Set the window height
      iframe.style.height = height + 'px';
    });
  };
})();
