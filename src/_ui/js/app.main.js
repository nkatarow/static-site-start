/*

    FILE: app.main.js
    DESCRIPTION: Basic App functions and config
    AUTHOR(S): Nick Katarow

    DEPENDENCIES:
    - jQuery 1.9.1

    TO DO:

*/
var SYMETRA = window.SYMETRA || {};

$(document).ready(function(){
    SYMETRA.init();
});

window.SYMETRA = {
    init: function () {
        var self = this,
			ua = window.navigator.userAgent,
			msie = self.detectIE();

        self.events.parent = this;

        // Init Components
        // self.nav.init();
    },
    events: {
        windowResize: function (event) {
            var self = this.parent,
                i,
                ii;

            if (event.width >= 800 && self.nav.isMobile) {
                // self.nav.mobileOff();
            } else if (event.width < 800 && !self.nav.isMobile) {
                // self.nav.mobileOn();
            }
        }
    },
    getMediaWidth: function () {
        var self = this,
            width;

        if (typeof matchMedia !== 'undefined') {
            width = self.bruteForceMediaWidth();
        } else {
            width = window.innerWidth || document.documentElement.clientWidth;
        }

        return width;
    },
    bruteForceMediaWidth: function () {
        var i = 0,
            found = false;

        while (!found) {
            if (matchMedia('(width: ' + i + 'px)').matches) {
                found = true;
            } else {
                i++;
            }

            // Prevent infinite loop if something goes horribly wrong
            if (i === 9999) {
                break;
            }
        }

        return i;
    },
	detectIE: function () {
		var ua = window.navigator.userAgent,
			msie = ua.indexOf('MSIE ');

		if (msie > 0) {
		// IE 10 or older => return version number
			return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
		}

		var trident = ua.indexOf('Trident/');

		if (trident > 0) {
			// IE 11 => return version number
			var rv = ua.indexOf('rv:');
			return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
		}

		var edge = ua.indexOf('Edge/');
		if (edge > 0) {
			// Edge (IE 12+) => return version number
			return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
		}

		// other browser
		return false;
	}
};
			
