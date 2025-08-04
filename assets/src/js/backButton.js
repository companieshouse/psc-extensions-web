alert('hello');
window.addEventListener("popstate", (event) => {
    window.location.href = '/psc-extensions/extension-already-submitted'
});
