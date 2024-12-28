
document.querySelectorAll('.menu-btn').forEach(button => {
  button.addEventListener('click', () => {
    const algoPage = button.getAttribute('data-algo');
    window.location.href = algoPage;
  });
});
