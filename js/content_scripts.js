
var DEFAULT_AUTO_RELOAD_INTERVAL = 1000;
var auto_reload_timer = null;

var render_dot_graph = function(dot_code) {
  // strip html tags in dot code.
  // because of chrome append html tags.
  dot_code = dot_code.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g,'');
  // drawing graph
  var png = Viz(dot_code, {format: "png-image-element", engine:"dot"});
  var img_area = $('<center></center>').append(png);
  $(document.body).empty();
  $(document.body).append(img_area);
};

var render_dot_from_url = function() {
  $.ajax({
    url: location.href,
    cache: false,
    success: function(txt) {
      render_dot_graph(txt);
    }
  });
};

var render_txt_from_url = function() {
  $.ajax({
    url: location.href,
    cache: false,
    success: function(txt) {
      $(document.body).empty();
      $(document.body).append(txt);
    }
  });
};

var auto_reload_start = function(interval) {
  auto_reload_stop();
  if (interval === undefined) {
    interval = DEFAULT_AUTO_RELOAD_INTERVAL;
  }
  render_dot_from_url();
  auto_reload_timer = setTimeout(auto_reload_start, interval, interval);
};

var auto_reload_stop = function() {
  clearTimeout(auto_reload_timer);
};

chrome.storage.onChanged.addListener(function(changes, namespace) {
  if (namespace === "sync") {
    var dr = changes.disable_render;
    var re = changes.reload_enable;
    var ri = changes.reload_interval;
    if (dr !== undefined) {
      if (dr.oldValue === true && dr.newValue === false) {
        main_process_start();
      }
      if (dr.oldValue === false && dr.newValue === true) {
        auto_reload_stop();
        render_txt_from_url();
      }
    }
    if (re !== undefined) {
      if (re.oldValue === true && re.newValue === false) {
        auto_reload_stop();
      }
      if (re.oldValue === false && re.newValue === true) {
        main_process_start();
      }
    }
    if (ri !== undefined) {
      main_process_start();
    }
  }
});

var main_process_start = function() {
  chrome.storage.sync.get("reload_enable", function(items) {
    if ((!chrome.runtime.error) && items.reload_enable === true) {
      chrome.storage.sync.get("reload_interval", function(items) {
        if ((!chrome.runtime.error) && items.reload_interval > 0) {
          auto_reload_start(items.reload_interval);
        }
      });
    }
  });
  render_dot_from_url();
};

$(function() {
  main_process_start();
});

