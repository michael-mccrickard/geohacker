

LessonMap = function() {

	 this.name = "lessonMap"; 

   this.state = new Blaze.ReactiveVar(0);

    //reactive level property:  mlWorld, mlContinent, mlRegion, mlCountry

    this.level = new Blaze.ReactiveVar( mlWorld );

	  this.worldMap = new LessonWorldMap( this );

    this.mapLevel = "";

    this.drawLevel = "";

    this.detailLevel = "";

    this.init = function() {

      this.state.set(0);
    },

    this.go = function() {

        Meteor.defer( function() { Control.playEffect("mapButton.mp3"); });

        hacker.worldMapTemplateReady = false;

        FlowRouter.go("/lessonMap");
    }

    this.getState = function() {

      return this.state.get();
    }

    this.setState = function(_val) {

      this.state.set( _val );
    }

  
    this.finishDraw = function() {

    }

}//end Map constructor


