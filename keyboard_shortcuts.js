function keyboard_shortcuts_show_help() {
  $('#keyboard_shortcuts_help').dialog('open');
}

$(function() {

  // initialize a dialog window
  $('#keyboard_shortcuts_help').dialog({
    autoOpen: false,
    draggable: true,
    modal: false,
    resizable: false,
    width: 750,
    title: rcmail.gettext("keyboard_shortcuts.keyboard_shortcuts")
  });

  // fire up the keypress event listener
  $(document).keypress(function (e) {
    return key_pressed(e);
  });


  function key_pressed (e) {
    // special case. If we hit ctrl-enter, and we're composing, and we have focus, then send email
    if (rcmail.env.action == 'compose' && e.which == 13 && e.ctrlKey && $("*:focus").is("#composebody")) {
      $('.button.send').click();
      return false;
    }

    // check if some element has focus. If it does, skip this plugin.
    if ( $("*:focus").is("textarea, input") ) return true;

    if (rcmail.env.action == 'compose' || rcmail.env.task == 'login' || e.ctrlKey || e.metaKey) return true;

    if (rcmail.env.action == '') {	// list mailbox

      if(rcmail.env.ks_functions[e.which]) {
        this[rcmail.env.ks_functions[e.which]]();
        return false;
      }

      switch (e.which) {
          case 63:		// ? = help
          //keyboard_shortcuts_show_help();
          var ks_function = rcmail.env.ks_functions[e.which];
          this[ks_function]();

          return false;
        case 65:		// A = mark all as read
          rcmail.command('select-all', 'page');
          rcmail.command('mark', 'read');
          return false;
        case 67:                // C = collapse-all
          rcmail.command('collapse-all');
          return false;
        case 69:                // E = expand-all
          rcmail.command('expand-all');
          return false;
        case 82:		// R = reply-all
          if (rcmail.message_list.selection.length == 1)
          rcmail.command('reply-all');
          return false;
        case 85:                // U = expand-unread
          rcmail.command('expand-unread');
          return false;
        case 97:		// a = select all
          rcmail.command('select-all', 'page');
          return false;
        case 99:		// c = compose
          rcmail.command('compose');
          return false;
        case 100:		// d = delete
          rcmail.command('delete', '', rcmail);
          return false;
        case 102:		// f = forward
          if (rcmail.message_list.selection.length == 1)
          rcmail.command('forward');
          return false;
        case 106:		// j = previous page (similar to Gmail)
          rcmail.command('previouspage');
          return false;
        case 107:		// k = next page (similar to Gmail)
          rcmail.command('nextpage');
          return false;
        case 112:		// p = print
          if (rcmail.message_list.selection.length == 1)
          rcmail.command('print');
          return false;
        case 114:		// r = reply
          if (rcmail.message_list.selection.length == 1)
          rcmail.command('reply');
          return false;
        case 115:		// s = search
          $('#quicksearchbox').focus();
          $('#quicksearchbox').select();
          return false;
        case 117:		// u = update (check for mail)
          rcmail.command('checkmail');
          return false;
        case 120:		// x = select
          var row_uid = $('#messagelist .focused').data('uid');
          rcube_list_widget._instances[0].highlight_row(row_uid, true);
          //I don't think I need to call select_row, it may do some extra stuff, but I don't think I need it.
          //rcmail.message_list.select_row(row_uid, CONTROL_KEY, true);
          rcube_list_widget._instances[0].triggerEvent('select');
          $("#selectcount").html(rcmail.message_list.selection.length);
          return false;
        case 108:		// l = move to
          //Simulate an event, anchored to a random element
          var e = {}
          e.target = $('#messagemenulink')
          //Clear any lingering selected elements
          $('#folder-selector ul li a.selected').removeClass('selected');
          //Open the folder selector
          $('#folder-selector ul li').show();
          rcmail.folder_selector(e, function(folder) { rcmail.command('move', folder); });
          $('#folder-selector-filter').focus();
          return false;
      }
    } else if (rcmail.env.action == 'show' || rcmail.env.action == 'preview') {
      switch (e.which) {
        case 82:		// R = reply-all
          rcmail.command('reply-all');
          return false;
        case 99:		// c = compose
          rcmail.command('compose');
          return false;
        case 100:		// d = delete
          rcmail.command('delete');
          return false;
        case 102:		// f = forward
          rcmail.command('forward');
          return false;
        case 106:		// j = previous message (similar to Gmail)
          rcmail.command('previousmessage');
          return false;
        case 107:		// k = next message (similar to Gmail)
          rcmail.command('nextmessage');
          return false;
        case 112:		// p = print
          rcmail.command('print');
          return false;
        case 114:		// r = reply
          rcmail.command('reply');
          return false;

      }
    }
    e.preventDefault();
  }
});

// support functions for each function we support
function ks_help() {
  keyboard_shortcuts_show_help();
}

var folderfilter = function(e, str) {
    var selectedFolder = $('#folder-selector ul li:visible a.selected');
    switch(e.which)
    {
    case 37: //left arrow
    case 38: //up arrow
        if(selectedFolder.length) {
            //What I should be able to do:
            //selectedFolder.parent().prev(':visible')
            //What I have to do because that doesn't work???:
            var newFolder = $('a', selectedFolder.parent().prevAll().filter(':visible')[0]);
        }
        else {
            var newFolder = $('#folder-selector ul li:visible a:last');
        }
        selectedFolder.removeClass('selected');
        $(newFolder).addClass('selected');
        $(newFolder).focus();
        break;
    case 39: //right arrow
    case 40: //down arrow
        if(selectedFolder.length) {
            //What I should be able to do:
            //selectedFolder.parent().next(':visible')
            //What I have to do because that doesn't work???:
            var newFolder = $('a', selectedFolder.parent().nextAll().filter(':visible')[0]);
        }
        else {
            var newFolder = $('#folder-selector ul li:visible a:first');
        }
        selectedFolder.removeClass('selected');
        $(newFolder).addClass('selected');
        $(newFolder).focus();
        break;
    case 13: //enter key
        rcmail.command('move', selectedFolder.data('id'));

        //Hide Menu
        var e = {}
        e.target = $('#messagemenulink')
        rcmail.hide_menu('folder-selector', e);

        //Reset filter
        $('#folder-selector-filter').val('');
        $('#folder-selector ul li').show();
        $('#folder-selector ul li a.selected').removeClass('selected');

        $('#messagemenulink').blur();
        break;
    case 9: //tab key
        break;
    default:
        str = str.toLowerCase();
        //TODO: Should be able to make this more performant
        $('#folder-selector ul li').show();
        $('#folder-selector ul li').filter(function (i, a) {
            t = $('a span', a).get(0).innerHTML;
            return t.toLowerCase().indexOf(str) < 0; }
        ).hide();
        $(selectedFolder).focus();
        break;
    }
    $('#folder-selector-filter').focus();
}
rcmail.addEventListener('init', function(evt) {
    //force the folder menu to populate
    var e = {}
    e.target = $('#messagemenulink')
    rcmail.folder_selector(e, function(folder) {});
    //hide it
    rcmail.hide_menu('folder-selector', e);

    //Now we need to mess up the folder selector quite a bit
    $('#folder-selector ul').before("<input style='text' id='folder-selector-filter' />");
    $('#folder-selector ul').wrap("<div id='folder-selector-inner'></div>");
    $('#folder-selector-filter').css({
        'width': '158px', 
        'padding': '2px 6px'
    });
    $('#folder-selector').css({
        'overflow':'',
        'overflow-y':'',
        'max-height':''
    });
    $('#folder-selector-inner').css({
        'overflow':'-moz-scrollbars-vertical',
        'overflow-y':'auto',
        'max-height':'250px'
    });

    //Add the event handlers
    $('#folder-selector-filter').keyup(function(e) { 
        folderfilter(e, $(this).val()); 
    });
    $('#folder-selector-filter').bind('mouseup', function(e) { 
        e.stopImmediatePropagation(); 
    });
});