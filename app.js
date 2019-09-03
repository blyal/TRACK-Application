var app = angular.module('TrackApp', []);

app.controller('TrackController', function($scope, $http) {


  
//These are given value to widen their scope from the limited ng-switch and ng-model scopes
  $scope.newRID = {value:''};
  $scope.newRCode = {value: ''};
  $scope.newRLocation = {value: ''};
  $scope.newRSection = {value: ''};
  $scope.newRType = {value: ''};
  $scope.newRGPS = {value: ''};

  $scope.newPID = {value: ''};
  $scope.newPRoad = {value: ''};
  $scope.newPName = {value: ''};
  $scope.newPStatus = {value: ''};
  $scope.newPStartDate = {value: ''};
  $scope.newPEndDate = {value: ''};
  $scope.newPContractor = {value: ''};
  $scope.newPCommentText = {value: ''};
  $scope.newPCommentAuthor = {value: ''};
  $scope.newPProblemText = {value: ''};
  $scope.newPProblemAuthor = {value: ''};

  //this ensures only the login form is shown on app load
  $scope.HideShowProjects = false;
  $scope.HideShowLogin = true;
  $scope.HideShowRoads = false;
  $scope.HideShowArchives = false;
  $scope.HideShowWorks = false;
  $scope.HideShowNav = false;
  $scope.logout = false;
  //function to get user list
  $scope.usersTarget = 'https://track.sim.vuw.ac.nz/api/monkhoceli/user_list.json';
  $http.get($scope.usersTarget)
    .then(function successCall(users) {
        $scope.userList = users.data.Users;
      },
      function errorCall() {
        $scope.feedback = "Error.";
      }
    );
    

  //function to get road list
  $scope.roadsTarget = 'https://track.sim.vuw.ac.nz/api/monkhoceli/road_dir.json';
  //the JS function which calls the JSON road data into the Roads list
  $http.get($scope.roadsTarget)
    .then(function successCall(roads) {
      $scope.roadsList = roads.data.Roads;
    });
  //function to get project list
  $scope.projectsTarget = 'https://track.sim.vuw.ac.nz/api/monkhoceli/project_dir.json';
  $http.get($scope.projectsTarget)
    .then(function successCall(projects) {
      $scope.projectsList = projects.data.Projects;
    });


  $scope.createRoad = function() {
    //Post function to create new roads, bound to an ng-submit
    //Road data variables are given angular value
    var newRoadData = {

      "ID": $scope.newRID.value,
      "Code": $scope.newRCode.value,
      "Type": $scope.newRType.value,
      "Section": $scope.newRSection.value,
      "Location": $scope.newRLocation.value,
      "GPS": $scope.newRGPS.value,
    };

    $http.post('https://track.sim.vuw.ac.nz/api/monkhoceli/update.road.json', newRoadData)
      .then(function successCall(response) {
        alert("Road Created Successfully");
        //second get to refresh roads list
        $http.get($scope.roadsTarget)
          .then(function successCall(response) {
            $scope.roadsList = response.data.Roads;

          }, function errorcall() {

          });

      }, function error(response) {
        alert("Error Road not Created");
      });

  };


  //Function to create new projects
  $scope.createProject = function() {
    //project variables are given easy to call angular value
    var newProjectData = {
      "ID": $scope.newPID.value,
      "Road": $scope.newPRoad.value,
      "Name": $scope.newPName.value,
      "Status": $scope.newPStatus.value,
      "StartDate": $scope.newPStartDate.value,
      "EndDate": $scope.newPEndDate.value,
      "Contractor": $scope.newPContractor.value,
    };

    $http.post('https://track.sim.vuw.ac.nz/api/monkhoceli/update.project.json', newProjectData)
      .then(function successCall(response) {
        alert("Project Created Successfully");
        //second get to refresh projects list
        $http.get($scope.projectsTarget)
          .then(function successCall(response) {
            $scope.projectsList = response.data.Projects;
          }, function errorcall() {

          });
      }, function error(response) {
        alert("Error Project not Created");
      });
  };
  //function to add new problems to projects
  $scope.addProblem = function(projectProblems, projectID){
    
    projectProblems.push({
      "Author": $scope.newPProblemAuthor.value,
      "Text": $scope.newPProblemText.value,
    });
    
    var newProblem = {
      "ID": projectID,
      "Problems": projectProblems,
    };
    
        //post function to send problem to array
    $http.post('https://track.sim.vuw.ac.nz/api/monkhoceli/update.project.json', newProblem)
      .then(function successCall(response) {
        alert("Problem Added");
        $http.get($scope.projectsTarget)
          .then(function successCall(response) {
            $scope.projectsList = response.data.Projects;
          }, function errorcall() {

          });
      }, function error(reponse) {
        alert("Error Problem not Added");
      });
  };
  //function to add new comments to projects
  $scope.addComment = function(projectComments, projectID) {

  //pushes data from created array to official projects array
    projectComments.push({
      "Author": $scope.newPCommentAuthor.value,
      "Text": $scope.newPCommentText.value
    });

    var newComment = {
      "ID": projectID,
      "Comments": projectComments,
    };
    //post function to send comment to array
    $http.post('https://track.sim.vuw.ac.nz/api/monkhoceli/update.project.json', newComment)
      .then(function successCall(response) {
        alert("Comment Added");
        $http.get($scope.projectsTarget)
          .then(function successCall(response) {
            $scope.projectsList = response.data.Projects;
          }, function errorcall() {

          });
      }, function error(reponse) {
        alert("Error Comment not Added");
      });
  };

  //Function For deleting Roads
  $scope.deleteRoad = function(Roads) {

    $http({

      method: 'DELETE',
      url: 'https://track.sim.vuw.ac.nz/api/monkhoceli/delete.road.' +
        $scope.roadID + '.json'


    }).then(function successCallback(response) {

      var index = $scope.roadsList.indexOf(Roads);
      $scope.roadsList.splice(index, 1);
      alert('Road Deleted');

    }, function errorCallback(response) {

      alert('Error deleting Road, trying again');


    });
  };

  //Function for deleting projects
  $scope.deleteProject = function(Projects) {

    $http({

      method: 'DELETE',
      url: 'https://track.sim.vuw.ac.nz/api/monkhoceli/delete.project.' +
        $scope.projectID + '.json'


    }).then(function successCallback(response) {

      var index = $scope.projectsList.indexOf(Projects);
      $scope.projectsList.splice(index, 1);
      alert('Project Deleted');

    }, function errorCallback(response) {

      alert('Error deleting Project, trying again');


    });
  };
  //function for remember me button
  $scope.rememberLoginDetails = function(rememberMe) {
    if ($scope.rememberMe) {
      return true;
    } else {
      $scope.userInput = null;
      $scope.passwordInput = null;
      $scope.userTypeLogin = null;
    }
  };


  //JS to open only the selected road (with ng-bind)
  $scope.selectThisRoad = function(road) {
    $scope.roadID = road.ID;
    $scope.roadCode = road.Code;
    $scope.roadType = road.Type;
    $scope.roadSection = road.Section;
    $scope.roadLocation = road.Location;
    $scope.roadGPS = road.GPS;
  };

  //JS to open only the selected project (with ng-bind)
  $scope.selectThisProject = function(project) {
    $scope.projectID = project.ID;
    $scope.projectRoad = project.Road;
    $scope.projectName = project.Name;
    $scope.projectStatus = project.Status;
    $scope.projectStartDate = project.StartDate;
    $scope.projectEndDate = project.EndDate;
    $scope.projectContractor = project.Contractor;
    $scope.projectProblems = project.Problems;
    $scope.projectComments = project.Comments;
    $scope.projectWorks = project.Works;
  };
    //variables for user logins/permissions
  var manager = document.getElementById("manager");
  var inspector = document.getElementById("inspector");
  var contractor = document.getElementById("contractor");

  //login loop combined with login ng-show function so only one form is seen on login
  $scope.ShowRoads1 = function() {
    for (var i = 0; i < $scope.userList.length; i++) {
      if ($scope.userInput == $scope.userList[i].LoginName && $scope.passwordInput == $scope.userList[i].Password &&
        $scope.userTypeLogin == $scope.userList[i].UserType && $scope.userTypeLogin == "contractor") {
        $scope.feedback = null;
        $scope.HideShowRoads = false;
        $scope.HideShowNav = false;
        $scope.HideShowProjects = true;
        $scope.HideShowLogin = false;
        $scope.logout = true;
        $scope.HideShowUsers = false;
        $scope.hideShowRoadTable1 = false;
        $scope.hideShowProjectTable1 = false; {
          return true;
        }
        //above is to hide the header if the user is a contractor
      } else if ($scope.userInput == $scope.userList[i].LoginName && $scope.passwordInput == $scope.userList[i].Password && $scope.userTypeLogin == $scope.userList[i].UserType) {
        $scope.feedback = null;
        $scope.HideShowRoads = true;
        $scope.HideShowNav = true;
        $scope.HideShowLogin = false;
        $scope.logout = true;
        $scope.HideShowUsers = false;
        $scope.hideShowRoadTable1 = false; {
          return true;
        }
      } //the output for a failed login attempt, nothing Changes
      else {
        $scope.HideShowRoads = false;
        $scope.HideShowLogin = true;
        $scope.HideShowProjects = false;
        $scope.HideShowArchives = false;
        $scope.HideShowWorks = false;
        $scope.HideShowNav = false;
        $scope.logout = false;
        $scope.HideShowUsers = false;
        $scope.hideShowRoadTable1 = false;
        $scope.feedback = "Login Failed";
      }
    }
  };
  //other show functions to add navigation
  $scope.showRoads2 = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = true;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadTable1 = false;
    $scope.hideShowAddRoad = false;
  };

  $scope.showRoadTable1 = function() {
    $scope.HideShowRoads = true;
    $scope.HideShowNav = true;
    $scope.HideShowLogin = false;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadTable1 = true;
  };

  $scope.showAddRoad = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = true;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowAddRoad = true;
  };


  $scope.ShowLogin = function() {
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = true;
    $scope.HideShowProjects = false;
    $scope.HideShowArchives = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = false;
    $scope.logout = false;
    $scope.HideShowUsers = false;
  };
  $scope.showArchive = function() {
    $scope.HideShowArchives = true;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadArchives = false;
    $scope.hideShowProjectArchives1 = false;
    $scope.hideShowProjectArchives1Table1 = false;
    $scope.hideShowWorksArchives1 = false;
    $scope.hideShowWorksArchives1Table1 = false;
  };
  $scope.showRoadArchiveTable1 = function() {
    $scope.HideShowArchives = true;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadArchives = true;
    $scope.hideShowProjectArchives1 = false;
    $scope.hideShowWorksArchives1 = false;
  };
  $scope.showProjectArchives1 = function() {
    $scope.HideShowArchives = true;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadArchives = true;
    $scope.hideShowProjectArchives1 = true;
    $scope.hideShowProjectArchives1Table1 = false;
    $scope.hideShowWorksArchives1 = false;
  };
  $scope.showProjectArchives1Table1 = function() {
    $scope.HideShowArchives = true;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadArchives = true;
    $scope.hideShowProjectArchives1 = true;
    $scope.hideShowProjectArchives1Table1 = true;
    $scope.hideShowWorksArchives1 = false;
  };
  $scope.showWorksArchives1 = function() {
    $scope.HideShowArchives = true;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadArchives = true;
    $scope.hideShowProjectArchives1 = true;
    $scope.hideShowProjectArchives1Table1 = true;
    $scope.hideShowWorksArchives1 = true;
    $scope.hideShowWorksArchives1Table1 = false;
  };
  $scope.showWorksArchives1Table1 = function() {
    $scope.HideShowArchives = true;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowRoadArchives = true;
    $scope.hideShowProjectArchives1 = true;
    $scope.hideShowProjectArchives1Table1 = true;
    $scope.hideShowWorksArchives1Table1 = true;
  };
  $scope.showProjects = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = true;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowProjectTable1 = false;
    $scope.hideShowAddProject = false;
    $scope.hideShowUpdateProject = false;
  };
  $scope.showProjectTable1 = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = true;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowProjectTable1 = true;
  };
  $scope.showAddProject = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = true;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowAddProject = true;
  };
  $scope.showUpdateProject = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = true;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowUpdateProject = true;
  };
  $scope.showWorks = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = true;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowWorksTable1 = false;
    $scope.hideShowAddWork = false;
  };
  $scope.showWorksTable1 = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = true;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowWorksTable1 = true;
  };
  $scope.showAddWork = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = true;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = false;
    $scope.hideShowAddWork = true;
  };
  $scope.showUsers = function() {
    $scope.HideShowArchives = false;
    $scope.HideShowRoads = false;
    $scope.HideShowLogin = false;
    $scope.HideShowProjects = false;
    $scope.HideShowWorks = false;
    $scope.HideShowNav = true;
    $scope.logout = true;
    $scope.HideShowUsers = true;
  };


});