$(document).ready(function () {
  

  $(function () {
    // var stickersArr = [];
    var dialog;
    var dialog_delete;
    var title = $('#title');
    var fullStory = $('#description');
    var priorityValue = 1;
    var date = $('#datepicker');
    var commentTextArea = $('#commentTextArea');
    var commentBtn = $('#btn-comment');
    var allCommentsList = $('#sortable-comments-on-dialog');

    getFromStorage();

    $(document).tooltip({});
    $("#datepicker").datepicker();
    $("#tabs").tabs({
      disabled: [1]
    });
    $("#sortable-comments-on-dialog").sortable();

    $("#description").froalaEditor({
      toolbarButtons: ['undo', 'redo', '|', 'bold', 'italic', 'underline', 'color', 'fontSize', 'fontFamily', 'emoticons'],
      inlineMode: false,
      emoticonsStep: 5
      

    })

    $(document).tooltip({
      content: function () {
        return $(this).prop('title');
      }
    });

    $(".column").sortable({
      connectWith: ".column",
      sliderHandle: ".portlet-content",
      cancel: ".portlet-toggle",
      placeholder: "portlet-placeholder ui-corner-all"
    });


    function iterateAll() {

      var allElementOnList1 = [];
      $('.col-1 .portlet').each(function () {
        var elemData = $(this).data('data');
        allElementOnList1.push(elemData);
      });


      var allElementOnList2 = [];
      $('.col-2 .portlet').each(function () {
        var elemData = $(this).data('data');
        allElementOnList2.push(elemData);
      });


      var allElementOnList3 = [];
      $('.col-3 .portlet').each(function () {
        var elemData = $(this).data('data');
        allElementOnList3.push(elemData);
      });

      var allListArr = [allElementOnList1, allElementOnList2, allElementOnList3];
      var allListJson = JSON.stringify(allListArr);
      localStorage.setItem('toDoList', allListJson);

    }

    function getFromStorage(){
      var allColumnsToLoad = JSON.parse(localStorage.getItem("toDoList"));
      if (allColumnsToLoad != null && allColumnsToLoad != undefined) {

        if (allColumnsToLoad[0] != null && allColumnsToLoad[0] != undefined) {
          for (var i = 0; i < allColumnsToLoad[0].length; i++) {
            if(allColumnsToLoad[0][i] != null && allColumnsToLoad[0][i] != undefined){
              loadPage(allColumnsToLoad[0][i], 1);
            }
          }
        }

        if (allColumnsToLoad[1] != null && allColumnsToLoad[1] != undefined) {
          for (var i = 0; i < allColumnsToLoad[1].length; i++) {
            if(allColumnsToLoad[1][i] != null && allColumnsToLoad[1][i] != undefined){
            loadPage(allColumnsToLoad[1][i], 2);
            }
          }
        }

        if (allColumnsToLoad[2] != null && allColumnsToLoad[2] != undefined) {
          for (var i = 0; i < allColumnsToLoad[2].length; i++) {
            if(allColumnsToLoad[2][i] != null && allColumnsToLoad[2][i] != undefined){
            loadPage(allColumnsToLoad[2][i], 3);
            }
          }
        }
      }     
    };
    
    function loadPage(elem, where) {
      console.log(elem);
      var sticker = $("<div class='portlet'>" +
        "<div class='portlet-content'>" +
        "<p class='portlet-p'>" + elem.title + "</p>" +
        "<span id='priorityValueSpan'>" + elem.priority + "</span>" +
        "</div>" +
        "<div class='edit-delete-btns'>" +
        "<span class='ui-icon ui-icon-pencil edit-btn '>" + "</span>" +
        "<span class='ui-icon ui-icon-trash delete-btn '>" + "</span>" +
        "</div>" +
        "</div>");
      sticker.attr('title', elem.description);
      var whereToAppend = $('.col-' + where)
      sticker.data('data', { title: elem.title , description: elem.description, priority: elem.priority, date: elem.date, comments: elem.comments })
      whereToAppend.append(sticker);
      $(".portlet")
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all");

      //   .find(".portlet-content");
    };

    $(".column").on("sortupdate", function (event, ui) {
        iterateAll();
    });

    function addStory(whereToAppend) {
      var sticker = $("<div class='portlet'>" +
        "<div class='portlet-content'>" +
        "<p class='portlet-p'>" + title.val() + "</p>" +
        "<span id='priorityValueSpan'>" + priorityValue + "</span>" +
        "</div>" +
        "<div class='edit-delete-btns'>" +
        "<span class='ui-icon ui-icon-pencil edit-btn '>" + "</span>" +
        "<span class='ui-icon ui-icon-trash delete-btn '>" + "</span>" +
        "</div>" +
        "</div>");
      sticker.attr('title', fullStory.val());
      setDataToElement(sticker);
      whereToAppend.parent().parent().append(sticker);
      // createStickerObject(whereToAppend);
      $(".portlet")
        .addClass("ui-widget ui-widget-content ui-helper-clearfix ui-corner-all");
      //   .find(".portlet-content");
      dialog.dialog("close");
    };

    function setDataToElement(elem) {
      var liTextArr = [];
      var localCommentList_li = allCommentsList.children().each(function () {
        liTextArr.push($(this).text());
      });
      elem.data('data', { title: title.val(), description: fullStory.val(), priority: priorityValue, date: date.val(), comments: liTextArr })
    };

    function editStory(elm, title, description, priority, date, comments) {
      var realElem = elm.parent().parent();
      realElem.find($('.portlet-p')).text(title);
      realElem.find($('#priorityValueSpan')).text(priority);
      realElem.attr('title', description);
      realElem.data('data', { title: title, description: description, priority: priority, date: date, comments: comments})
    };

    dialog = $("#dialog-add").dialog({
      autoOpen: false,
      height: 480,
      width: 600,
      modal: true,
      whichColumn: '',
      buttons: {
        "add": function () {
            addStory(whichColumn);
            iterateAll();
        },
        Cancel: function () {
          dialog.dialog("close");
        },
      },
      close: function () {
        title.val('');
        // fullStory.val('');
        fullStory.froalaEditor('html.set', '');
        date.val('');
        $("#slider").slider({
          max: 5,
          min: 1,
          value: 1,
          create: function () {
            sliderHandle.text($(this).slider("value"));
          },
          slide: function (event, ui) {
            sliderHandle.text(ui.value);
            priorityValue = (ui.value);
          }
        });
      },
    });

    dialog_delete = $("#dialog-confirm").dialog({
      element: '',
      autoOpen: false,
      resizable: false,
      height: "auto",
      width: 400,
      modal: true,
      buttons: {
        "Delete all items": function () {
          $(this).dialog("close");
          removeSticker(element);
          iterateAll();
        },
        Cancel: function () {
          $(this).dialog("close");
        }
      }
    });

    $(".clumn-button").button().on("click", function () {
      dialog.dialog("open");
      dialog.dialog(whichColumn = $(this));
      dialog.dialog(buttons = {
        buttons: {
          "add": function () {
            if(title.val().length > 0){
              title.removeClass( "ui-state-error" );
            addStory(whichColumn);
            iterateAll();
          }else{
            title.addClass( "ui-state-error" );
          }
          },
          Cancel: function () {
            dialog.dialog("close");
          },
        },
      });
    });

    $(document).on("click", ".delete-btn", function () {
      dialog_delete.dialog("open");
      dialog_delete.dialog(element = $(this));
    });

    function removeSticker(elm) {
      $(elm).parent().parent().remove();
    }

    $(document).on("click", ".edit-btn", function () {
      editStickerDlg($(this));
    });

    function editStickerDlg(elm) {
      var realElem = elm.parent().parent();
      dialog.dialog("open");
      title.val(realElem.data('data').title);
      // fullStory.val(realElem.data('data').description);
      fullStory.froalaEditor('html.set', realElem.data('data').description);
      date.val(realElem.data('data').date);
      sliderHandle.text(realElem.data('data').priority);
      priorityValue = (realElem.data('data').priority);
      allCommentsList.append(appendCommentBackToDialog(realElem.data('data').comments));
      dialog.dialog({
        autoOpen: false,
        height: 480,
        width: 600,
        modal: true,
        whichColumn: '',
        buttons: {
          "update": function () {
            var liTextArr = [];
            var localCommentList_li = allCommentsList.children().each(function(){
              liTextArr.push($(this).text());
            });
            editStory(elm, title.val(), fullStory.val(), priorityValue, date.val(), liTextArr);
            iterateAll();
            dialog.dialog("close");
          },
          Cancel: function () {
            dialog.dialog("close");
          },
        },
        close: function () {
          title.val('');
          // fullStory.val('');
          fullStory.froalaEditor('html.set', '');
          date.val('');
          allCommentsList.empty();
          $("#slider").slider({
            max: 5,
            min: 1,
            value: 1,
            create: function () {
              sliderHandle.text($(this).slider("value"));
            },
            slide: function (event, ui) {
              sliderHandle.text(ui.value);
              priorityValue = (ui.value);
            }
          });
        }
      });
      $("#tabs").tabs({
        disabled: []
      });
    }

    var sliderHandle = $("#priority-slider");
    $("#slider").slider({
      max: 5,
      min: 1,
      create: function () {
        sliderHandle.text($(this).slider("value"));
      },
      slide: function (event, ui) {
        sliderHandle.text(ui.value);
        priorityValue = (ui.value);
      }
    });

    $('#btn-comment').button().on('click', function () {
      addNewComment();
      commentTextArea.val('');

    });

    function addNewComment() {
      if(commentTextArea.val().length > 0){
              commentTextArea.removeClass( "ui-state-error" );
              var newComment = $("<li class='ui-state-default'>" + commentTextArea.val() +
                "<span class='ui-icon ui-icon-trash comment-delete-btn'>" +
                "</span>" +
                "</li>"
              );

              allCommentsList.append(newComment);

          }else{
            commentTextArea.addClass( "ui-state-error" );
          }
    };

    function appendCommentBackToDialog(textArr) {
      for (var i = 0; i < textArr.length; i++) {
        var newComment = $("<li class='ui-state-default'>" + textArr[i] +
          "<span class='ui-icon ui-icon-trash comment-delete-btn'>" +
          "</span>" +
          "</li>"
        );
        allCommentsList.append(newComment);
      }
    };

    $(document).on("click", ".comment-delete-btn", function () {
      $(this).parent().remove();

    });

  });

});
