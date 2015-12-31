$(function() {
  chrome.storage.sync.get("disable_render", function(items) {
    if (!chrome.runtime.error) {
      var disable_render = items.disable_render;
      if (disable_render === undefined) {
        disable_render = true;
      }
      $('#disable_render').prop('checked', disable_render);
    }
  });

  chrome.storage.sync.get("reload_enable", function(items) {
    if (!chrome.runtime.error) {
      var reload_enable = items.reload_enable;
      if (reload_enable === undefined) {
        reload_enable = true;
      }
      $('#reload_enable').prop('checked', reload_enable);
    }
  });

  chrome.storage.sync.get("reload_interval", function(items) {
    if (!chrome.runtime.error) {
      var reload_interval = items.reload_interval;
      if (reload_interval === undefined) {
        reload_interval = 1;
      }
      $('#reload_interval').val(reload_interval);
    }
  });

  $('#disable_render').change(function() {
    chrome.storage.sync.set({"disable_render" : $('#disable_render').prop('checked')}, function() {
      if (chrome.runtime.error) {
        console.log("Storage save runtime error.(disable_render)");
      }
    });
  });

  $('#reload_enable').change(function() {
    chrome.storage.sync.set({"reload_enable" : $('#reload_enable').prop('checked')}, function() {
      if (chrome.runtime.error) {
        console.log("Storage save runtime error.(reload_enable)");
      }
    });
  });
  
  $('#reload_interval').change(function() {
    chrome.storage.sync.set({"reload_interval" : $('#reload_interval').val()}, function() {
      if (chrome.runtime.error) {
        console.log("Storage save runtime error.(reload_interval)");
      }
    });
  });
});
