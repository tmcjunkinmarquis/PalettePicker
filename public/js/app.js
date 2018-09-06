
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

function lockColor(event) {
  const circle = $(event.target).parent();
  circle.toggleClass('is-stored');
  circle.hasClass('is-stored')
    ? (event.target.src = './images/locked.svg')
    : (event.target.src = './images/unlocked.svg');
}

function makeRandomColors() {
  const randomColor = "#000000".replace(/0/g, function () { return (~~(Math.random() * 16)).toString(16); });
  return randomColor;
}

const handleDiffPalClick = () => {
  $('.circle').each((index, singleCircle) => {
    const haveLockClass = singleCircle.classList.contains('is-stored');
    if (!haveLockClass) {
      $(singleCircle).css('background-color', makeRandomColors());
      $(singleCircle).children('.color-name').text(makeRandomColors())
    }
  });
}

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

}

function putProjectInContainer(projectName) {
  $('.project-cards-container').prepend(`
      <div class="project">
      <h4>${projectName}</h4>
      </div><hr>
      `);
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

$('.lock-icon').on('click', lockColor)
$('.different-palette').click(handleDiffPalClick);

$(document).ready(async () => {
  handleDiffPalClick()
  await displayProjects();
  await displayPalettes();
});


