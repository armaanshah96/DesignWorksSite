var app = angular.module('website', ['ngAnimate', 'ui.bootstrap']);

app.controller('MainCtrl', function ($scope, $timeout, QueueService) {
    var INTERVAL = 3000,
        slides = [{id:"image00", src:"./images/image00.jpg"},
        {id:"image01", src:"./images/image01.jpg"},
        {id:"image02", src:"./images/image02.jpg"},
        {id:"image03", src:"./images/image03.jpg"},
        {id:"image04", src:"./images/image04.jpg"}];

    function setCurrentSlideIndex(index) {
        $scope.currentIndex = index;
    }

    function isCurrentSlideIndex(index) {
        return $scope.currentIndex === index;
    }

    function nextSlide() {
        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
        $timeout(nextSlide, INTERVAL);
    }

    function setCurrentAnimation(animation) {
        $scope.currentAnimation = animation;
    }

    function isCurrentAnimation(animation) {
        return $scope.currentAnimation === animation;
    }

    function loadSlides() {
        QueueService.loadManifest(slides);
    }

    $scope.$on('queueProgress', function(event, queueProgress) {
        $scope.$apply(function(){
            $scope.progress = queueProgress.progress * 100;
        });
    });

    $scope.$on('queueComplete', function(event, slides) {
        $scope.$apply(function(){
            $scope.slides = slides;
            $scope.loaded = true;

            $timeout(nextSlide, INTERVAL);
        });
    });

    $scope.progress = 0;
    $scope.loaded = false;
    $scope.currentIndex = 0;
    $scope.currentAnimation = 'slide-left-animation';

    $scope.setCurrentSlideIndex = setCurrentSlideIndex;
    $scope.isCurrentSlideIndex = isCurrentSlideIndex;
    $scope.setCurrentAnimation = setCurrentAnimation;
    $scope.isCurrentAnimation = isCurrentAnimation;

    loadSlides();
});

app.factory('QueueService', function($rootScope){
    var queue = new createjs.LoadQueue(true);

    function loadManifest(manifest) {
        queue.loadManifest(manifest);

        queue.on('progress', function(event) {
            $rootScope.$broadcast('queueProgress', event);
        });

        queue.on('complete', function() {
            $rootScope.$broadcast('queueComplete', manifest);
        });
    }

    return {
        loadManifest: loadManifest
    }
})

app.animation('.slide-left-animation', function ($window) {
    return {
        enter: function (element, done) {
            TweenMax.fromTo(element, 1, { left: $window.innerWidth}, {left: 0, onComplete: done});
        },

        leave: function (element, done) {
            TweenMax.to(element, 1, {left: -$window.innerWidth, onComplete: done});
        }
    };
});

app.animation('.slide-down-animation', function ($window) {
    return {
        enter: function (element, done) {
            TweenMax.fromTo(element, 1, { top: -$window.innerHeight}, {top: 0, onComplete: done});
        },

        leave: function (element, done) {
            TweenMax.to(element, 1, {top: $window.innerHeight, onComplete: done});
        }
    };
});

app.animation('.fade-in-animation', function ($window) {
    return {
        enter: function (element, done) {
            TweenMax.fromTo(element, 1, { opacity: 0}, {opacity: 1, onComplete: done});
        },

        leave: function (element, done) {
            TweenMax.to(element, 1, {opacity: 0, onComplete: done});
        }
    };
});

app.directive('bgImage', function ($window, $timeout) {
    return function (scope, element, attrs) {
        var resizeBG = function () {
            var bgwidth = element.width();
            var bgheight = element.height();

            var winwidth = $window.innerWidth;
            var winheight = $window.innerHeight;

            var widthratio = winwidth / bgwidth;
            var heightratio = winheight / bgheight;

            var widthdiff = heightratio * bgwidth;
            var heightdiff = widthratio * bgheight;

            if (heightdiff > winheight) {
                element.css({
                    width: winwidth + 'px',
                    height: heightdiff + 'px'
                });
            } else {
                element.css({
                    width: widthdiff + 'px',
                    height: winheight + 'px'
                });
            }
        };

        var windowElement = angular.element($window);
        windowElement.resize(resizeBG);

        element.bind('load', function () {
            resizeBG();
        });
    }
});


////var app = angular.module('website',[]);
////app.controller('CoverController', function() {
////    this.test = "../public/img/portfolio/chinanight.jpg";
////    this.slides = [{
////        name: 'Peanut Butter',
////        description: "Branding and Logo Design for ",
////        color: '#2fe430',
////        image: "../public/img/portfolio/chinanight.jpg"
////    }, 
////        {
////        name: 'Northwestern Ski Trip',
////        description: "Apparel Design for ",
////        color: '#000000',
////        image: "../public/img/portfolio/lion.png"
////    }, 
////        {
////        name: 'Minibees Bakery',
////        description: "Logo Design for ",
////        color: '#000000',
////        image: "../public/img/portfolio/screen_shot_2015-01-17_at_9.16.45_pm.png"
////    }];
////        // checks for current slide and sets current slide
////    this.currentIndex = 0;
////        this.setCurrentSlideIndex = function (index) {
////            this.currentIndex = index;
////        };
////        this.isCurrentSlideIndex = function (index) {
////            return this.currentIndex === index;
////        };
////    
////
////});
//
//var app = angular.module('website', ['ngAnimate', 'ui.bootstrap']);
//app.controller('MainCtrl', function ($scope, $timeout) {
//    var INTERVAL = 3000,
//        slides = [{
//                    name: 'Peanut Butter',
//                    description: "Branding and Logo Design for ",
//                    color: '#2fe430',
//                    image: "../public/img/portfolio/house.jpg"
//                }, 
//                    {
//                    name: 'Northwestern Ski Trip',
//                    description: "Apparel Design for ",
//                    color: '#000000',
//                    image: "../public/img/portfolio/lion.png"
//                }, 
//                    {
//                    name: 'Minibees Bakery',
//                    description: "Logo Design for ",
//                    color: '#000000',
//                    image: "../public/img/portfolio/screen_shot_2015-01-17_at_9.16.45_pm.png"
//                }];
//    
//    // slide index set function - set current index to parameter
//    function setCurrentSlideIndex(index) {
//        $scope.currentIndex = index;
//    }
//    
//    // slide index get function - confirmation True vs. False
//    function isCurrentSlideIndex(index) {
//        return $scope.currentIndex === index;
//    }
//    
//    // increment slide index continue $timeout function creating infinite loop - incrementing on INTERVAL time
//    function nextSlide() {
//        $scope.currentIndex = ($scope.currentIndex < $scope.slides.length - 1) ? ++$scope.currentIndex : 0;
//        $timeout(nextSlide, INTERVAL);
//    }
//    
//    // loading slides - calling nextSlide on timeout
//    function loadSlides() {
//        $timeout(nextSlide, INTERVAL);
//    }
//    
//    $scope.slides = slides;
//    $scope.currentIndex = 0; // starting index
//    $scope.setCurrentSlideIndex = setCurrentSlideIndex; //
//    $scope.isCurrentSlideIndex = isCurrentSlideIndex; // 
//    loadSlides(); // starts the loop
//});
//
//app.directive('bgImage', function ($window, $timeout) {
//    return function (scope, element, attrs) {
//        var resizeBG = function () {
//            var bgwidth = element.width();
//            var bgheight = element.height();
//
//            var winwidth = $window.innerWidth;
//            var winheight = $window.innerHeight;
//
//            var widthratio = winwidth / bgwidth;
//            var heightratio = winheight / bgheight;
//
//            var widthdiff = heightratio * bgwidth;
//            var heightdiff = widthratio * bgheight;
//
//            if (heightdiff > winheight) {
//                element.css({
//                    width: winwidth + 'px',
//                    height: heightdiff + 'px'
//                });
//            } else {
//                element.css({
//                    width: widthdiff + 'px',
//                    height: winheight + 'px'
//                });
//            }
//        };
//
//        var windowElement = angular.element($window);
//        windowElement.resize(resizeBG);
//
//        element.bind('load', function () {
//            resizeBG();
//        });
//    }
//});
//
////var app = angular.module('website', ['ngAnimate']);
////
////
//////cover controller
////app.controller('CoverController', function($scope){
////    // controls image, and image related description
////    // contains a stagnant line about designworks
////
////    // setting relevant information for cover slider
////    $scope.slides = [{
////        name: 'Peanut Butter',
////        description: "Branding and Logo Design for ",
////        color: '#000000',
////        image: "public/img/portfolio/chinanight.jpg"
////    }, 
////        {
////        name: 'Northwestern Ski Trip',
////        description: "Apparel Design for ",
////        color: '#000000',
////        image: "public/img/portfolio/lion.png"
////    }, 
////        {
////        name: 'Minibees Bakery',
////        description: "Logo Design for ",
////        color: '#000000',
////        image: "public/img/portfolio/screen_shot_2015-01-17_at_9.16.45_pm.png"
////    }];
////
////    // checks for current slide and sets current slide
////    <pre><code>    $scope.currentIndex = 0;
////        $scope.setCurrentSlideIndex = function (index) {
////            $scope.currentIndex = index;
////        };
////        $scope.isCurrentSlideIndex = function (index) {
////            return $scope.currentIndex === index;
////        };
////});
////    </code></pre>
////
//////portfolio controller
////app.controller('PortfolioController', function(){});
////    // starts with taster of some images and desriptions
////
////    // portfolio details controller
////    app.controller('ImageDetailsController', function(){});
////                // shows some image and description 
////                // repeatable image and descriptions
////        // changes to entire expandable, scrollable portfolio
////            // figure this out later
////
////    app.controller('FullPortfolioController', function(){
////        this.repetoire = [
////'DALC.jpg', 'aibootcamp.jpg', 'americanpath.jpg', 'bigsean.png', 'birdart.png', 'chinanight.jpg', 'counterpoint.jpg', 'dfareal.jpg', 'dilloshirt.jpg', 'donut.jpg', 'download.jpeg', 'emilybrochure.jpg', 'font.jpg', 'hamiltoncoffeehouse.png', 'house.jpg', 'icons.png', 'isa_cso.jpg', 'lifetimebonds.png', 'lion.png', 'norris.png', 'nua.jpg', 'nuvc.jpg', 'passionpit.jpg', 'phantom.png', 'polisci.png', 'refreshdance.png', 'screen_shot_2015-01-17_at_9.16.45_pm.png', 'sheparddm.png', 'squareship.png', 'turbin2.jpg', 'turbin3.jpg', 'turbin4.jpg', 'vas2.jpeg', 'wholeplanet.jpg', 'yoga.jpg'
////        ];
////    });
////
//////steps controller
////app.controller('StepsController', function(){});
////    // repeat the format for each step
////    // == number and then description div
////
//////team controller
////app.controller('TeamController', function(){});
////    // for each row set the starting point using css gridding
////    this.members = ['public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg',               'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg', 'public/img/team/Armaan1.jpg'];
////
////
////var slides = [{
////    name: 'Peanut Butter',
////    description: "Branding and Logo Design for "
////    color: '#000000',
////    images: [
////        "public/img/portfolio/chinanight.jpg"
////    ],
////}, 
////    {
////    name: 'Northwestern Ski Trip',
////    description: "Apparel Design for ",
////    color: '#000000',
////    images: [
////        "public/img/portfolio/lion.png"
////    ],
////}, 
////    {
////    name: 'Minibees Bakery',
////    description: "Logo Design for ",
////    color: '#000000',
////    images: [
////        "public/img/portfolio/screen_shot_2015-01-17_at_9.16.45_pm.png"
////    ],
////}];
////
////
