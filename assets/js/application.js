// The main application file
!function(){

  'use strict';

  // --------------------------------------------------------------------------------------
  // Globals
  // Each one of globals has a special prefix "global__" for making code more friendly
  // --------------------------------------------------------------------------------------
  
  /** List of status values for the Lead */
  var global__contactStatusList = {
      'new': 'Новый',
      'pending': 'В обработке',
      'initiated': 'Проведена презентация',
      'cancelled': 'Отказ',
      'succeeded': 'Передан в BPM'   
  };
	
	var application = angular.module('ru.soup', ['ngMaterial']);

  
  application.directive("projectWatch", function() {
        return {
            restrict: 'E',
            templateUrl: '/templates/soup.watch.project.html',
            controller: 'ProjectController',
            link: function($scope, element, attrs) {
              $scope.initialProject(window.location.href.split("/").pop()); 
            }
        };
    });

  /*******************************
  * \                           /
  *  \   PROJECT CONTROLLER    /
  * 
  *  TODO: Nothing to do here, yet.
  *
  */
  application.controller(
    'ProjectController', 
    ['$scope', '$mdDialog', '$mdMedia', '$http', function($scope, $mdDialog, $mdMedia, $http){

      $scope.project = "";

      $scope.projectList = [];

      $scope.showProjectForm = function( event, project ) {

      $mdDialog.show({
            controller: ProjectDialogController,
            templateUrl: '/templates/soup.forms.project.html',
            parent: angular.element(document.body),
            targetEvent: event,
            clickOutsideToClose: false,
            fullscreen: false,
            locals: {
              project: angular.copy(project),
              config : {
                csrf: $scope.csrf
              }
            }
        });
      };

      $scope.showCompletionDate = function( date ){
       if(date === null || date === undefined){
          return "Не назначена";
        }
        else{
          date = new Date(date).getTime();
          return date;
        }
      };

      $scope.deleteProject = function(project){

        if(confirm("Проект '" + project.title + "' будет удален из базы СУП." )){
              
              $http.get("/delete/" + project.id)
              .then(function(response){
                if(response.data.status === 1) {
                    var newProjectList = {};
                    
                    angular.forEach($scope.projectList, function(target, index) {
                        if(target.id !== project.id) {
                          newProjectList[index] = $scope.projectList[index];
                        }
                    });  

                    $scope.projectList = newProjectList; 
                } else {
                  alert(response.data.error);
                  return;
                }
              });
              
        
        }

      };

      $scope.initialProject = function(id){

          $http.get("/project/"+id)
          .then(function( response ){

              // Now we have all projects in SOUP
              $scope.project = response.data.project;

              var currentPercent = 0;

              for(var i=0; i<$scope.project.stages.length; i++){
                if($scope.project.stages[i].checked){
                  currentPercent++;
                }
              }


              var p = currentPercent/($scope.project.stages.length/100);

              $scope.project.progress = p - (p%1); 
              
              //console.log("Запрошенный проект:" + $scope.project);
          });
      };

      $scope.$on('project-updated', function(event, project) {
          console.log(project);
          var targetFound = false;

          // Ok, lets find and replace target instance
          angular.forEach($scope.projectList, function(target, index) {
              if(target.id === project.id) {
                $scope.projectList[index] = project;
                targetFound = true;
              }
          });       

          // or add a new one
          if(!targetFound) {
            $scope.projectList.push(project);
          }
      });

      !function($scope, $http){

        $http.get("/projectList")
          .then(function( response ){

              // Now we have all projects in SOUP
              $scope.projectList = response.data;

          });

      }($scope, $http); 

  }])
  .config(function($mdThemingProvider) {

      // Configure a dark theme with primary foreground yellow
      $mdThemingProvider.theme('docs-dark', 'default')
          .primaryPalette('yellow')
          .dark();
  });

  function ProjectDialogController($rootScope, $scope, $mdDialog, $http, $window, config, project) {
      
      // Should we use provided project or create a new one?
      $scope.project =  project || {
         title: null,
         description: null,
         stages: [{'id':'step1', 'title':'1. Наименование этапа', 'checked':'flase'}]
      };

      $scope.addNewStep = function() {
        var newStep = $scope.project.stages.length+1;
        $scope.project.stages.push({'id':'step'+newStep, 'title': newStep + '. Наименование этапа'});
      };
        
      $scope.removeStep = function() {
        var lastItem = $scope.project.stages.length-1;
        $scope.project.stages.splice(lastItem);
      };

      if (typeof $scope.project.completionDate === "string"){
          $scope.project.completionDate = new Date($scope.project.completionDate);
          $scope.project.completionDateLong = $scope.project.completionDate.getTime();
      }

      var _csrf = config.csrf;

      $scope.hide = function() {
        $mdDialog.hide();
      };

      $scope.cancel = function() {
        $mdDialog.cancel();
      };

      $scope.save = function() {

        $http.post("/create", { 
            project: $scope.project,
            _csrf: _csrf 
          })

          .then(function( response ) {

            console.log( response.data )

            if(response.data.status === 1) {
              // Fire in the HOLE!
              $rootScope.$broadcast('project-updated', response.data.project);
            } else {
              alert(response.data.error);
              return;
            }

            $mdDialog.hide();

          }, function(error) {
            
            console.log(error);
          });
      };

  };



}()