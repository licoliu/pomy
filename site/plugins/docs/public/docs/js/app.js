function autoHeightFrame(frame, offset) {
    if (document.getElementById) {
        if (frame && !window.opera) {
            if (frame.contentDocument && frame.contentDocument.body.offsetHeight) {
                frame.height = frame.contentDocument.body.offsetHeight + offset;
            } else if (frame.Document && frame.Document.body.scrollHeight) {
                frame.height = frame.Document.body.scrollHeight + offset;
            }
        }
    }
}