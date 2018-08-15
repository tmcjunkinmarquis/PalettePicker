$(document).ready(function () {
  

  
  function getPalettes() {
    const myRequest = new Request('http://localhost:3000/api/v1/palettes', { method: 'GET'});
    fetch(myRequest)
    .then(response => {
        if (response.status === 200) {
          return response.json();
        } else {
          throw new Error('Something went wrong on api server!');
        }
      })
      .then(response => {
        console.debug(response);
        // ...
      }).catch(error => {
        console.error(error);
      });
  }

  function getProjects (){
    const myRequest = new Request('http://localhost:3000/api/v1/projects', { method: 'GET' });
    const promise = fetch(myRequest)
    .then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        throw new Error('Something went wrong on api server!');
      }
    })
    .then(response => {
      console.debug(response);
      // ...
    }).catch(error => {
      console.error(error);
    });
    return promise;
  }
  
  let projectsData = getProjects()
  let projects = projectsData.then(function(result) {
    console.log(result);
    ;
  });
  console.log(projects);
  
  let palettesData = getPalettes();


  function makeRandomColors() {
      var randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
      return randomColor;
  }

  function handleClick(event) { 
    event.preventDefault();
    return $('.circle').each(function () { 
      $(this).css('background-color', makeRandomColors());
    });
  }

  $('.different-palette').on('click', handleClick);

  function saveProjectToOption() {
    
  }

  $(saveProjectToOption);

});
 