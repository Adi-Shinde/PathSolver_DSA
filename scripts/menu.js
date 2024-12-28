// Redirect to the selected algorithm page
document.querySelectorAll('.menu-btn').forEach(button => {
  button.addEventListener('click', () => {
    const algoPage = button.getAttribute('data-algo');
    window.location.href = algoPage;
  });
});
