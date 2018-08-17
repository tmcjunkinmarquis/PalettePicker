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

  function populateProjectsOnPageLoad(result) {

    const dbLength = result.length;
    for (let i = 0; i < dbLength; i++) {
      const projectName = result[i].project_name;
      $('.project-cards-container').prepend(`
      <div class="project">
      <h4>${projectName}</h4>
      </div><hr>
      `);
    } 

    function palettes() {
      let palettesData = getPalettes();
      return palettesData.then(function (palettesResult) {


        for(let i=0; i<palettesResult.length; i++){
          var palette = `<div>${palettesResult[i].palette_name}
          </div>`;
          
          $('h4').each(function () {
            console.log($(this).html(), palettesResult[i].project_id);
            
            console.log($(this).html() === palettesResult[i].project_id);
  
          });
        } 

      }); 
    }

   palettes(); 
    
    
    
  
    
    
    
    
    
    
  }
  
  

  function makeRandomColors() {
      var randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
      return randomColor;
  }

  function handleClick(event) { 
    event.preventDefault();
    $('.circle').each(function () { 
      const color = makeRandomColors()
      $(this).css('background-color', color);
      $(this).children('.color-name').text(color)
    }); 
  }

  $('.different-palette').on('click', handleClick);

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

  $('#palette-save-button').on('click', function (event) {
    event.preventDefault();
    //locate the project name
    $('.project').each(function(){
      console.log($('.project').children('h4').html());
      
      
      // if ($('.project').children('h4').html()){

      //  }
      
    })
    //prepend paletteName inside 
    
      // $("li").each(function () {
      //   $(this).addClass("foo");
      // });

    // const paletteName = $('.palette-input').val();
    // $('.project-cards-container').prepend(`<div>
    //     <h4>${projectName}</h4>
    //     <div>${paletteName}</div>
    //     <div></div>
    //   </div>
    // `);
  });

  function lockColor(circle, color) {
    circle.toggleClass('is-stored');        
  }

  $('.lock-icon').on('click', (event)=>{
    const color = $(event.target).prev().text();
    lockColor($(event.target).parent(), color);

  });

  

});
 