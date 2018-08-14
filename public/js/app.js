window.addEventListener('load', () => {
  const element = $('#app');

  
  
  let cardTemplate = document.getElementById('card-template').innerHTML();
  var anchor = document.createElement('span')

  const html = template();
  element.html(html);
});