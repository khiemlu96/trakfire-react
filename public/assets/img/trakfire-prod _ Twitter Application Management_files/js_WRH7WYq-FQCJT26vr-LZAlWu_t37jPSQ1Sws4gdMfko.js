!function(t,e,n){"use strict";e.behaviors.helper_tfw={attach:function(){var t=this;"undefined"!=typeof twttr&&"undefined"!=typeof n._gaq&&void 0!==twttr.ready&&void 0!==twttr.events&&twttr.ready(function(e){// Track when a user clicks on the follow button
e.events.bind("follow",function(e){t.track_follow_click(e)})})},track_follow_click:function(t){var e="gaz",n=t.type,a=t.data.screen_name;_gaq.push(["_trackEvent",e,n,a])}}}(jQuery,Drupal,window);;