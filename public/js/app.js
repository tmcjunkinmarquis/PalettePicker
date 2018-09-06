$(document).ready(async () => {
  await displayProjects();
  await displayPalettes();
});

const getPalettes = async () => {
  try {
    const palettesResponse = await fetch('http://localhost:3000/api/v1/palettes');
    if (palettesResponse.status === 200) {
      return await palettesResponse.json();
    } else {
      throw Error('Something went wrong on api server!');
    }
  } catch (error) {
    throw Error(`Your request failed. (error: ${error.message})`);
  }
}

const getProjects = async () => {
  try {
    const projectsResponse = await fetch('http://localhost:3000/api/v1/projects')
    if (projectsResponse.status === 200) {
      return await projectsResponse.json();
    } else {
      throw Error('Something went wrong on api server!');
    }
  } catch (error) {
    throw Error(`Your request failed. (error: ${error.message})`);
  }
}

const displayProjects = async () => {
  let projectsData = await getProjects();
  projectsData.forEach(project => {
    populateProject(project);
  });
}

const displayPalettes = async () => {
  let palettesData = await getPalettes();
  palettesData.forEach(palette => {
    populatePalette(palette);
  });
}

function populateProject(project) {
  $('.saved-projects').prepend(`
      <div class="project" id=project${project.id}>
        <h4 class='project-name'>${project.project_name}</h4>
      </div><hr>
      `);
  $('select').append(`<option data-projectId=${project.id} value=${project.project_name}>${project.project_name}</option>`)
}

function populatePalette(palette) {
  console.log('palette', $(`#project${palette.project_id}`))
  $(`#project${palette.project_id}`).append(`
    <div class="palette-in-project">
      <p class="palette-name-in-project">${palette.palette_name}</p>
      <div class="circle-for-project" id="one-for-project" style='background-color:${palette.color_one}'></div>
      <div class="circle-for-project" id="two-for-project" style='background-color:${palette.color_two}'></div>
      <div class="circle-for-project" id="three-for-project" style='background-color:${palette.color_three}'></div>
      <div class="circle-for-project" id="four-for-project" style='background-color:${palette.color_four}'></div>
      <div class="circle-for-project" id="five-for-project" style='background-color:${palette.color_five}'></div>
    </div>
  `);
};

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
    if ($(this).hasClass('is-stored')) {
      return; //skips and goes to next circle
    }
    const color = makeRandomColors();
    $(this).css('background-color', color);
    $(this).children('.color-name').text(color)
  });
}

$('.different-palette').on('click', handleDiffPalClick);

// $('#project-save-button').on('click',function(event){
//   event.preventDefault();
//   const projectName = $('.project-input').val();

//   $('select').append(`< option > ${ projectName }</option > `);
// $('.project-cards-container').prepend(`
//   <div class="project">
//   <h4>${projectName}</h4>
//   </div><hr>
//   `);
// });

function putProjectIdOnOption(response, projectName) {
  $('select').append(`<option selected="selected" value=${response.id}>${projectName}</option>`);
  putProjectInContainer(projectName);
  console.log('in option', 'hope');

}

function putProjectInContainer(projectName) {
  $('.project-cards-container').prepend(`
      <div class="project">
      <h4>${projectName}</h4>
      </div><hr>
      `);
  console.log('incontainer', 'howdy');

}

$('button[type="submit"]').click(function () {
  //   // Before the request starts, show the 'Loading message...'
  //   $('.result').text('File is being uploaded...');
  event.preventDefault();
  const projectName = $('.project-input').val();
  const url = 'http://localhost:3000/api/v1/projects'
  const optionsObj = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ project_name: projectName })
  };

  return fetch(url, optionsObj)
    .then(projectsResponse => {
      return projectsResponse.json();
    })
    .then((projectsResponse) => {
      putProjectIdOnOption(projectsResponse, projectName);
    })
    .catch(error => {
      $('.result').text('Whoops! There was an error in the request.');
    });
});

$('#palette-save-button[type="submit"]').on('click', function (event) {
  event.preventDefault();
  const paletteName = $('.palette-input').val();
  const projectNumber = $('#project-select option:selected');
  console.log(projectNumber);

  const colorOne = $('#one').next().text();
  const colorTwo = $('#two').next().text();
  const colorThree = $('#three').next().text();
  const colorFour = $('#four').next().text();
  const colorFive = $('#five').next().text();
  const url = 'http://localhost:3000/api/v1/palettes'
  const optionsObj = {
    method: 'POST',
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(
      {
        palette_name: paletteName,
        projecte_id: projectNumber,
        color_one: colorOne,
        color_two: colorTwo,
        color_three: colorThree,
        color_four: colorFour,
        color_five: colorFive
      }
    )
  };

  return fetch(url, optionsObj)
    .then(palettesResponse => {
      return palettesResponse.json();
    })
    .catch(error => {
      $('.result').text('Whoops! There was an error in the request.');
    });

});

