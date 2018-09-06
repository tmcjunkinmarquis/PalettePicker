// var populateProjectsOnPageLoad = function (projects) {

//   const dbLength = projects.length;
//   for (let i = 0; i < dbLength; i++) {
//     const projectName = projects[i].project_name;
//     const projectId = projects[i].project_id;
//     $('.project-cards-container').prepend(`
//       <div class="project">
//       <h4 class=${projectId}>${projectName}</h4>
//       </div><hr>
//       `);
//     $('select').append(`<option value=${projectId}>${projectName}</option>`);
//     palettes(projects[i])
//   }

//   function palettes(project) {
//     let palettesData = getPalettes();

//     return palettesData.then(function (palettesResult) {
//       for (let i = 0; i < palettesResult.length; i++) {
//         var palette = `<div>${palettesResult[i].palette_name}
//           </div>`;
//         $('h4').each(function () {
//           if ((palettesResult[i].project_id === project.id) && ($(this).html() === project.project_name)) {
//             $(this).append(`<div class="palette-in-project">
//                 <p class="palette-name-in-project">${palettesResult[i].palette_name}</p>
//               <div class="circle-for-project" id="one-for-project"></div>
//               <div class="circle-for-project" id="two-for-project"></div>
//               <div class="circle-for-project" id="three-for-project"></div>
//               <div class="circle-for-project" id="four-for-project"></div>
//               <div class="circle-for-project" id="five-for-project"></div>
//               </div>
//               `);
//             colorsForLittleCircles(this, palettesResult[i]);
//           }
//         });
//       }
//     });
//     function colorsForLittleCircles(element, specificPalette) {
//       $(element).find('#one-for-project').css('background-color', specificPalette.color_one);
//       $(element).find('#two-for-project').css('background-color', specificPalette.color_two);
//       $(element).find('#three-for-project').css('background-color', specificPalette.color_three);
//       $(element).find('#four-for-project').css('background-color', specificPalette.color_four);
//       $(element).find('#five-for-project').css('background-color', specificPalette.color_five);
//     }
//   }
// }

// module.exports = populateProjectsOnPageLoad;