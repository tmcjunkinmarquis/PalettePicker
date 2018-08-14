window.addEventListener('load', () => {
  
  $(".project-cards-container").load("/api/v1/projects");

  makeRandomColors = ()=>{
    let N = 5;
    Array(N + 1).join((Math.random().toString(36) + '00000000000000000').slice(2, 18)).slice(0, N); //https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript/8084248#8084248
  }

  getProjects = ()=>{
    fetch('api/v1/projects').then(response => {
      response.json().then(json => {
        let projectsData = json;
      });
    });
  };

  getPalettes = async () => {
    let response = await fetch('api/v1/palettes');
    let palettesData = await response.json();
  }
  
});