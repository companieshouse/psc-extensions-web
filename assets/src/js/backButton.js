history.replaceState('', '', '/psc-extensions/extension-already-submitted');
history.pushState('', '', window.location.href);
window.addEventListener('popstate', () => {
    alert('hello');
    window.location.href = '/psc-extensions/extension-already-submitted'
});

