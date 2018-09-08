const getPalettes = async () => {
  try {
    const palettesResponse = await fetch(
      'http://localhost:3000/api/v1/palettes'
    );
    if (palettesResponse.status === 200) {
      return await palettesResponse.json();
    } else {
      throw Error('Something went wrong on api server!');
    }
  } catch (error) {
    throw Error(`Your request failed. (error: ${error.message})`);
  }
};

const getProjects = async () => {
  try {
    const projectsResponse = await fetch(
      'http://localhost:3000/api/v1/projects'
    );
    if (projectsResponse.status === 200) {
      return await projectsResponse.json();
    } else {
      throw Error('Something went wrong on api server!');
    }
  } catch (error) {
    throw Error(`Your request failed. (error: ${error.message})`);
  }
};

const displayProjects = async () => {
  let projectsData = await getProjects();
  projectsData.forEach(project => {
    populateProject(project);
  });
};

const displayPalettes = async () => {
  let palettesData = await getPalettes();
  palettesData.forEach(palette => {
    populatePalette(palette);
  });
};

function populateProject(project) {
  $('.saved-projects').prepend(`
      <div class="project" id=project${project.id}>
        <h4 class='project-name'>${project.project_name}</h4>
      </div><hr>
      `);
  $('select').prepend(
    `<option selected="selected" value=${project.id}>${
    project.project_name
    }</option>`
  );
}

function populatePalette(palette) {
  $(`#project${palette.project_id}`).append(`
    <div class="palette-in-project" id=${palette.id}>
      <p class="palette-name-in-project">${palette.palette_name}</p>
      <div class="circle-for-project" id="one-for-project" style='background-color:${
    palette.color_one
    }'></div>
      <div class="circle-for-project" id="two-for-project" style='background-color:${
    palette.color_two
    }'></div>
      <div class="circle-for-project" id="three-for-project" style='background-color:${
    palette.color_three
    }'></div>
      <div class="circle-for-project" id="four-for-project" style='background-color:${
    palette.color_four
    }'></div>
      <div class="circle-for-project" id="five-for-project" style='background-color:${
    palette.color_five
    }'></div>
      <img class="palette-delete" src="./images/trashcan.svg" alt="trashcan">
    </div>
  `);
}

function lockColor(event) {
  const circle = $(event.target).parent();
  circle.toggleClass('is-stored');
  circle.hasClass('is-stored')
    ? (event.target.src = './images/locked.svg')
    : (event.target.src = './images/unlocked.svg');
}

function makeRandomColors() {
  return '#000000'.replace(/0/g, () => (~~(Math.random() * 16)).toString(16));
}

const handleDiffPalClick = () => {
  $('.circle').each((index, singleCircle) => {
    const haveIsStoredClass = singleCircle.classList.contains('is-stored');
    const color = makeRandomColors();
    if (!haveIsStoredClass) {
      $(singleCircle).css('background-color', color);
      $(singleCircle)
        .children('.color-name')
        .text(color);
    }
  });
};

const saveProject = async event => {
  event.preventDefault();
  const projectName = $('.project-input').val();
  const savedProjects = await getProjects();
  const projectExists = savedProjects.some(project => {
    return project.project_name === projectName;
  });

  if (!projectExists && projectName.length) {
    try {
      const optionsObj = {
        method: 'POST',
        body: JSON.stringify({ project_name: projectName }),
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch('/api/v1/projects', optionsObj);
      if (response.status !== 201) {
        throw Error(`${response.status}`);
      }
      const id = await response.json();
      const project = { ...id, project_name: projectName };
      populateProject(project);
      $('.project-input').val('');
      return id;
    } catch (error) {
      $('.result').text(`Your request failed. (error: ${error.message})`);
    }
  } else {
    alert('Please provide a unique name');
  }
};

const savePalette = async event => {
  event.preventDefault();
  const paletteName = $('.palette-input').val();
  const projectNumber = $('#project-select option:selected').val();
  const projectNumberInt = parseInt(projectNumber);
  const colorOne = $('#one')
    .text()
    .trim();
  const colorTwo = $('#two')
    .text()
    .trim();
  const colorThree = $('#three')
    .text()
    .trim();
  const colorFour = $('#four')
    .text()
    .trim();
  const colorFive = $('#five')
    .text()
    .trim();
  const palette = {
    palette_name: paletteName,
    color_one: colorOne,
    color_two: colorTwo,
    color_three: colorThree,
    color_four: colorFour,
    color_five: colorFive,
    project_id: projectNumber
  };

  const savedPalettes = await getPalettes();

  const paletteExists = savedPalettes.some(palette => {
    return palette.palette_name === paletteName;
  });

  if (!paletteExists && paletteName.length) {
    try {
      const url = 'http://localhost:3000/api/v1/palettes';
      const optionsObj = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(palette)
      };
      const paletteResponse = await fetch(url, optionsObj);
      console.log(paletteResponse);

      if (paletteResponse.status !== 201) {
        throw Error(`${response.status}`);
      }
      const id = await paletteResponse.json();

      populatePalette({ id, ...palette });
      $('.palette-input').val('');
      return id;
    } catch (error) {
      $('.result').text(`Your request failed. (error: ${error.message})`);
    }
  } else {
    alert('Please provide a unique name');
  }
};

const deletePalette = async () => {
  const palette = event.path[1];
  try {
    const options = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };
    const response = await fetch('/api/v1/palettes/' + palette.id, options);
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
    palette.remove();
  } catch (error) {
    throw new Error(`Network request failed. (error: ${error.message})`);
  }
};

const convertToHex = rgb => {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2);
  }
  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
};

const littlePaletteToBigPalette = () => {
  const children = event.path[1].children;
  const colorArray = Array.from(children).filter(element => {
    return element.className === 'circle-for-project';
  });
  const hexColorArray = colorArray.map(color => {
    return convertToHex(color.style.backgroundColor);
  });
  $('#one').css('background-color', hexColorArray[0]);
  $('#two').css('background-color', hexColorArray[1]);
  $('#three').css('background-color', hexColorArray[2]);
  $('#four').css('background-color', hexColorArray[3]);
  $('#five').css('background-color', hexColorArray[4]);
};

$('#palette-save-button').on('click', savePalette);
$('#project-save-button').on('click', saveProject);
$('.lock-icon').on('click', lockColor);
$('.different-palette').on('click', handleDiffPalClick);
$('.saved-projects').on('click', '.palette-delete', deletePalette);
$('.saved-projects').on('click', '.palette-in-project', littlePaletteToBigPalette);

$(document).ready(async () => {
  handleDiffPalClick();
  await displayProjects();
  await displayPalettes();
});
