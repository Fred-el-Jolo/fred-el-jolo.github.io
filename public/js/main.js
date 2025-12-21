// Register button handlers

const themeButton = document.getElementById('switch-theme');
console.log('fred', themeButton);
themeButton?.addEventListener('click', () => {
  document.body?.classList?.toggle('dark-theme');
})


const fontButton = document.getElementById('switch-font');
fontButton?.addEventListener('click', () => {
  document.body?.classList?.toggle('dys-font');
})




const ecoModeButton = document.getElementById('switch-eco-mode');
ecoModeButton?.addEventListener('click', () => {
  document.body?.classList?.toggle('eco-mode');
})

