

$(document).ready(function () {
  
  function getPalettes() {
    const myRequest = new Request('http://localhost:3000/api/v1/palettes', { method: 'GET'});
    return fetch(myRequest)
    .then(palettesResponse => {
        return palettesResponse.json();
      })
      .catch(error => {
        console.error(error);
      });
  }

  function getProjects (){
    const myRequest = new Request('http://localhost:3000/api/v1/projects', { method: 'GET' });
    return fetch(myRequest)
    .then(projectsResponse => {
      if (projectsResponse.status === 200) {
        return projectsResponse.json();
      } else {
        throw new Error('Something went wrong on api server!');
      }
    })
    .catch(error => {
      console.error(error);
    });
  }
  
  let projectsData = getProjects();
  projectsData.then(function(result) {
    populateProjectsOnPageLoad(result);
  });

  function populateProjectsOnPageLoad(projects) {

    const dbLength = projects.length;
    for (let i = 0; i < dbLength; i++) {
      const projectName = projects[i].project_name;
      $('.project-cards-container').prepend(`
      <div class="project">
      <h4>${projectName}</h4>
      </div><hr>
      `);
      palettes(projects[i])
    } 

    function palettes(project) {
      let palettesData = getPalettes();
      
      return palettesData.then(function (palettesResult) {
        for(let i=0; i<palettesResult.length; i++){
          // console.log(palettesResult[i].project_id);
          var palette = `<div>${palettesResult[i].palette_name}
          </div>`;
          $('h4').each(function () {
            if ((palettesResult[i].project_id === project.id) && ($(this).html()===project.project_name)){
              $(this).append(`<div class="palette-in-project">
                <p class="palette-name-in-project">${palettesResult[i].palette_name}</p>
              <div class="circle-for-project" id="one-for-project"></div>
              <div class="circle-for-project" id="two-for-project"></div>
              <div class="circle-for-project" id="three-for-project"></div>
              <div class="circle-for-project" id="four-for-project"></div>
              <div class="circle-for-project" id="five-for-project"></div>
              </div>
              `);
              colorsForLittleCircles(this, palettesResult[i]);
            }
          });
        } 
      });
      function colorsForLittleCircles (element, specificPalette){
        $(element).find('#one-for-project').css('background-color', specificPalette.color_one);
        $(element).find('#two-for-project').css('background-color', specificPalette.color_two);
        $(element).find('#three-for-project').css('background-color', specificPalette.color_three);
        $(element).find('#four-for-project').css('background-color', specificPalette.color_four);
        $(element).find('#five-for-project').css('background-color', specificPalette.color_five);
      }
    }  
  }

  function lockColor(circle, color) {
    circle.toggleClass('is-stored');
  }

  $('.lock-icon').on('click', (event) => {
    const color = $(event.target).prev().text();
    lockColor($(event.target).parent(), color);
  });

  function makeRandomColors() {
      var randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
      return randomColor;
  }

  function handleDiffPalClick(event) { 
    event.preventDefault();
    $('.circle').each(function () {
      if($(this).hasClass('is-stored')){
        return; //skips and goes to next circle
      }
      const color = makeRandomColors();
      $(this).css('background-color', color);
      $(this).children('.color-name').text(color)
    }); 
  }

  $('.different-palette').on('click', handleDiffPalClick);

  $('#project-save-button').on('click',function(event){
    event.preventDefault();
    const projectName = $('.project-input').val();
    $('select').append(`<option value=${projectName}>${projectName}</option>`);
    $('.project-cards-container').prepend(`
      <div class="project">
      <h4>${projectName}</h4>
      </div><hr>
      `);
  });

  $('button[type="submit"]').click(function () {
  //   // Before the request starts, show the 'Loading message...'
  //   $('.result').text('File is being uploaded...');
    event.preventDefault();
    const projectName = $('.project-input').val();
    const url = 'http://localhost:3000/api/v1/projects'
    const optionsObj = {
      method: 'POST',
      headers: {"Content-Type": "application/json"},  
      body: JSON.stringify({ project_name: projectName })
    };
    
    return fetch(url, optionsObj)
    
      .then(projectsResponse => {
        return projectsResponse.json();
      })
      .catch(error => {
        $('.result').text('Whoops! There was an error in the request.');
      });
  });

  $('#palette-save-button[type="submit"]').on('click', function (event) {
    event.preventDefault();
    const paletteName = $('.palette-input').val();
    const url = 'http://localhost:3000/api/v1/palettes'

    const myRequest = new Request(url, { method: 'POST', body: { palette_name: paletteName } });
    return fetch(myRequest)

      .then(palettesResponse => {
        return palettesResponse.json();
      })
      .catch(error => {
        $('.result').text('Whoops! There was an error in the request.');
      });
    
  });

  
  

});
 