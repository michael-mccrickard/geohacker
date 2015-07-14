//***********************************************************************
//        Object-related
//***********************************************************************

Object.defineReactiveProperty = function(target, prop, val) {

  var currentVal = val;
  var dep = new Deps.Dependency;

  Object.defineProperty(target, prop, {

    get: function() {
      dep.depend();
      return currentVal;
    },

    set: function (newVal) {
      if (newVal !== currentVal) {
        currentVal = newVal;
        dep.changed();
      }
    }
  });
}


String.prototype.replaceAll = function(search, replace) {
    if (replace === undefined) {
        return this.toString();
    }
    return this.split(search).join(replace);
}

//***********************************************************************
//        SPECIAL EFFECTS
//***********************************************************************

fadeIn = function(_which) {

  var ele = document.getElementById( _which );

  if (ele == null) return;

  ele.style.transition = "opacity 0.5s linear 0s";

  ele.style.opacity = 1;
}

/*

fadeOut = function(_which) {
return;

  var ele = document.getElementById( _which );

  if (ele == null) return;

  ele.style.transition = "opacity 0.5s linear 0s";

  ele.style.opacity = 0;
}
*/

//***********************************************************************
//				TEMPORARY
//***********************************************************************

c = function(_obj) {

  console.log(_obj);
}