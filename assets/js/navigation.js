const menuNodes = document.getElementsByClassName('js-menu-icon');
for (let menu of menuNodes) {
  menu.onclick = menuClickHandler;
}
function menuClickHandler() {
  const navigationNodes = document.getElementsByClassName('js-navigation');
  const navigationNode = navigationNodes[0];
  if (navigationNode && navigationNode.dataset) {
    const currentSetting = navigationNode.dataset.expanded;
    navigationNode.dataset.expanded = currentSetting == "true" ? false : true;
  }
}
