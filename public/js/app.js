// $().ready(()=>{
  // const projects = getProjects();
  // const palettes = getPalettes();

// });

$(document).ready(function () {

  function makeRandomColors() {
    
  }

  function handleClick(event) {
    
    event.preventDefault();
    return $('.circle').each(function () {
      
      $(this).css('background-color', function() {
        var randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
        
        return randomColor
        // const upperColor = color.toUpperCase()
        // return upperColor;
      });
    });
  }

  

  $('.different-palette').on('click', handleClick);

  // $.fn.redraw = function () {
  //   $(this).each(function () {
  //     var redraw = this.offsetHeight;
  //   });
  // };
  // You'd then call the method like this:

  // $('.theElement').redraw();
});



  
  
// const getProjects = () => {
//   fetch('http://localhost:3000/api/v1/projects').then(response => {
//     response.json().then(json => {
//       let projectsData = json;
//     });
//   });
// };


  

//   const getPalettes = async () => {
//     const url = 'http://localhost:3000/api/v1/palettes'
//     const response = await fetch(url);
//     const palettesData = await response.json();
//     return palettesData;
//   }