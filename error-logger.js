window.onerror = function(msg, url, l, c, e) { alert('Error: ' + msg + '\n' + url + ':' + l); }; window.addEventListener('unhandledrejection', function(e) { alert('Promise: ' + e.reason); });
