﻿function initialiseDialogBoxes() {
    $("#dialog-input-text").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
                $(this).data("dialog_ok")();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialog-input-text").keyup(function (e) {
        if (e.keyCode == 13) {
            $(this).dialog("close");
            $(this).data("dialog_ok")();
        }
    });
    $("#dialog-add-script").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
                $(this).data("dialog_ok")();
            },
            "Cancel": function () {
                $(this).dialog("close");
            }
        }
    });
    $("#dialog-error").dialog({
        autoOpen: false,
        modal: true,
        resizable: false,
        width: 400,
        buttons: {
            "OK": function () {
                $(this).dialog("close");
            }
        },
        close: function () {
            $(this).data("dialog_close")();
        }
    });
    $("#dialog-error").data("dialog_close", function () { });
}

function showDialog(prompt, defaultText, ok, list, listPrompt) {
    $("#dialog-input-text-entry").val(defaultText);
    $("#dialog-input-text-prompt").html(prompt + ":");
    var showList = false;
    var parent = "";
    if (typeof list != "undefined") {
        showList = (list.length > 1);
        if (list.length == 1) {
            parent = list[0];
        }
    }
    if (showList) {
        $("#dialog-input-text-list-prompt").html(listPrompt + ":");
        $("#dialog-input-text-options").empty();
        $.each(list, function (index, value) {
            $("#dialog-input-text-options").append($("<option/>").text(value));
        });
        $("#dialog-input-text-list").show();
    }
    else {
        $("#dialog-input-text-list").hide();
    }
    $("#dialog-input-text").data("dialog_ok", function () {
        if (showList) {
            parent = $("#dialog-input-text-options option:selected").text();
        }
        ok($("#dialog-input-text-entry").val(), parent);
    });
    $("#dialog-input-text").dialog("open");
}

function initialiseButtons() {
    $("#button-addroom").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        addNewRoom();
    });
    $("#button-addobject").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        addNewObject();
    });
    $("#buttonset-add").buttonset();
    $("#button-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        toplevelAdditionalAction("main delete");
    });
    $("#button-undo").button({
        icons: { primary: "ui-icon-arrowreturnthick-1-w" }
    }).click(function () {
        toplevelAdditionalAction("main undo");
    });
    $("#button-redo").button({
        icons: { primary: "ui-icon-arrowreturnthick-1-e" }
    }).click(function () {
        toplevelAdditionalAction("main redo");
    });
    $("#buttonset-undoredo").buttonset();
    $("#button-cut").button({
        icons: { primary: "ui-icon-scissors" }
    }).click(function () {
        toplevelAdditionalAction("main cut");
    });
    $("#button-copy").button({
        icons: { primary: "ui-icon-copy" }
    }).click(function () {
        toplevelAdditionalAction("main copy");
    });
    $("#button-paste").button({
        icons: { primary: "ui-icon-clipboard" }
    }).click(function () {
        toplevelAdditionalAction("main paste");
    });
    $("#buttonset-clipboard").buttonset();
    $("#button-play").button({
        icons: { primary: "ui-icon-play" }
    }).click(function () {
        toplevelAdditionalAction("main play");
    });
}

function initialiseElementEditor(tab) {
    var pageTitle = $("#_pageTitle").val();
    document.title = pageTitle;
    var selectTab = $("#_additionalActionTab").val();
    var refreshTreeSelectElement = $("#_refreshTreeSelectElement").val();
    if (refreshTreeSelectElement.length > 0) {
        refreshTree(refreshTreeSelectElement, selectTab);
        return;
    }
    $("#elementEditorTabs").tabs({
        create: function () {
            if (selectTab && selectTab.length > 0) {
                $("#elementEditorTabs").tabs("select", parseInt(selectTab));
            }
        }
    });
    $("#centerPane").scrollTop(0);
    $(".stringlist-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        showDialog($(this).attr("data-prompt"), "", function (text) {
            sendAdditionalAction("stringlist add " + key + ";" + text);
        });
    });
    $(".stringlist-edit").button({
        icons: { primary: "ui-icon-pencil" }
    }).click(function () {
        stringListEdit($(this).attr("data-key"), $(this).attr("data-prompt"));
    });
    $(".stringlist-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        sendAdditionalAction("stringlist delete " + key + ";" + selectElement.val());
    });
    $(".stringlist").dblclick(function () {
        stringListEdit($(this).attr("data-key"), $(this).attr("data-prompt"));
    });
    $(".stringlist-edit, .stringlist-delete").each(function () {
        $(this).button("disable");
    });
    $(".stringlist").change(function () {
        var editButton = $("#stringlist-" + $(this).attr("data-key") + "-edit");
        var deleteButton = $("#stringlist-" + $(this).attr("data-key") + "-delete");
        var selectElement = $("#" + this.id + " option:selected");
        if (selectElement.val() === undefined) {
            editButton.button("disable");
            deleteButton.button("disable");
        }
        else {
            editButton.button("enable");
            deleteButton.button("enable");
        }
    });
    $(".script-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        $("#dialog-add-script").data("dialog_ok", function () {
            var create = $("#dialog-add-script-form input[type='radio']:checked").val();
            sendAdditionalAction("script add " + key + ";" + create);
        });
        $("#dialog-add-script").dialog("open");
        $("#dialog-add-script-accordion").accordion({
            autoHeight: false
        });
    });
    $(".script-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selected = getSelectedScripts(key);
        if (selected.length > 0) {
            sendAdditionalAction("script delete " + key + ";" + selected);
        }
    });
    $(".script-if-add-else").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script addelse " + key );
    });
    $(".script-if-add-elseif").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script addelseif " + key);
    });
    $(".script-select").click(function () {
        var key = $(this).attr("data-key");
        var selectedScripts = getSelectedScripts(key);
        if (selectedScripts.length > 0) {
            $("#script-toolbar-" + key).show(200);
        }
        else {
            $("#script-toolbar-" + key).hide(200);
        }
    });
    $(".ifsection-select").click(function () {
        var key = $(this).attr("data-key");
        var selectedSections = getSelectedIfSections(key);
        if (selectedSections.length > 0) {
            $("#ifsection-toolbar-" + key).show(200);
        }
        else {
            $("#ifsection-toolbar-" + key).hide(200);
        }
    });
    $(".ifsection-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("script deleteifsection " + key + ";" + getSelectedIfSections(key));
    });
    $(".expression-dropdown").change(function () {
        var key = $(this).attr("data-key");
        var showExpression = ($(this).find('option:selected').text() == "expression");
        if (showExpression) {
            $("#" + key + "-simpleeditor").hide();
            $("#" + key + "-expressioneditor").show();
        }
        else {
            $("#" + key + "-expressioneditor").hide();
            $("#" + key + "-simpleeditor").show();
        }
    });
    $(".template-dropdown").change(function () {
        var key = $(this).attr("data-key");
        var text = $(this).find('option:selected').text();
        if (text == "expression") {
            $("#" + key + "-templateeditor").hide();
            $("#" + key).show();
        }
        else {
            $("#_ignoreExpression").val(key);
            sendAdditionalAction("script settemplate " + key + ";" + text);
        }
    });
    $(".script-dictionary-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        showDialog($(this).attr("data-prompt"), "", function (text) {
            sendAdditionalAction("scriptdictionary add " + key + ";" + text);
        });
    });
    $(".error-clear").button().click(function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("error clear " + key);
    });
    $(".scriptDictionarySection-select").click(function () {
        var key = $(this).attr("data-key");
        var selectedSections = getSelectedScriptDictionaryItems(key);
        if (selectedSections.length > 0) {
            $("#scriptDictionarySection-toolbar-" + key).show(200);
        }
        else {
            $("#scriptDictionarySection-toolbar-" + key).hide(200);
        }
    });
    $(".scriptDictionarySection-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        sendAdditionalAction("scriptdictionary delete " + key + ";" + getSelectedScriptDictionaryItems(key));
    });
    $('textarea.richtext').tinymce({
        script_url: '../../Scripts/tiny_mce/tiny_mce.js',
        theme: "advanced",
        plugins: "inlinepopups,searchreplace,paste,directionality",
        theme_advanced_buttons1: "bold,italic,underline",
        theme_advanced_buttons2: "",
        theme_advanced_buttons3: "",
        theme_advanced_toolbar_location: "top",
        theme_advanced_toolbar_align: "left",
        theme_advanced_statusbar_location: "none",
        forced_root_block: "",
        force_br_newlines : true,
        force_p_newlines : false,
        gecko_spellcheck: true
    });
    $(".multi-dropdown").change(function () {
        var key = $(this).attr("data-key");
        var value = $(this).find('option:selected').attr("value");
        sendAdditionalAction("multi set " + key + ";" + value);
    });
    $(".types-dropdown").change(function () {
        var key = $(this).attr("data-key");
        var value = $(this).find('option:selected').attr("value");
        sendAdditionalAction("types set " + key + ";" + value);
    });
    $(".elementslist-add").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var elementType = $(this).attr("data-elementtype");
        var objectType = $(this).attr("data-objecttype");
        var filter = $(this).attr("data-filter");
        addNewElement(elementType, objectType, filter);
    });
    $(".elementslist-edit").button({
        icons: { primary: "ui-icon-pencil" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        selectTreeNode(selectElement.val());
    });
    $(".elementslist-delete").button({
        icons: { primary: "ui-icon-trash" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        sendAdditionalAction("elementslist delete " + selectElement.val());
    });
    $(".elementslist-moveup").button({
        icons: { primary: "ui-icon-arrowthick-1-n" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        var previous = selectElement.attr("data-previous");
        sendAdditionalAction("elementslist swap " + selectElement.val() + ";" + previous);
    });
    $(".elementslist-movedown").button({
        icons: { primary: "ui-icon-arrowthick-1-s" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var selectElement = $("#select-" + key + " option:selected");
        var next = selectElement.attr("data-next");
        sendAdditionalAction("elementslist swap " + selectElement.val() + ";" + next);
    });
    $(".elementslist").change(function () {
        var editButton = $("#elementslist-edit-" + $(this).attr("data-key"));
        var deleteButton = $("#elementslist-delete-" + $(this).attr("data-key"));
        var moveupButton = $("#elementslist-moveup-" + $(this).attr("data-key"));
        var movedownButton = $("#elementslist-movedown-" + $(this).attr("data-key"));
        var selectElement = $("#" + this.id + " option:selected");
        if (selectElement.val() === undefined) {
            editButton.button("disable");
            deleteButton.button("disable");
            moveupButton.button("disable");
            movedownButton.button("disable");
        }
        else {
            editButton.button("enable");
            deleteButton.button("enable");

            var canMoveUp = (selectElement.attr("data-previous").length > 0);
            if (canMoveUp) {
                moveupButton.button("enable");
            }
            else {
                moveupButton.button("disable");
            }

            var canMoveDown = (selectElement.attr("data-next").length > 0);
            if (canMoveDown) {
                movedownButton.button("enable");
            }
            else {
                movedownButton.button("disable");
            }

            var canDelete = selectElement.attr("data-candelete") == "1";
            if (canDelete) {
                deleteButton.button("enable");
            }
            else {
                deleteButton.button("disable");
            }
        }
    });
    $(".elementslist-edit, .elementslist-delete, .elementslist-moveup, .elementslist-movedown").each(function () {
        $(this).button("disable");
    });
    $(".compass-direction").change(function () {
        var key = $(this).attr("data-key");
        setSelectedDirection(key);
    });
    $(".compass-direction-edit").button({
        icons: { primary: "ui-icon-pencil" }
    }).click(function () {
        var key = $(this).attr("data-key");
        selectTreeNode(key);
    });
    $(".compass-direction-link").click(function (e) {
        selectTreeNode($(this).html());
        e.stopPropagation();
    });
    $(".compassDirection").click(function () {
        var key = $(this).attr("data-key");
        var option = $(this).attr("data-option");
        $("#" + option).attr("checked", "checked");
        setSelectedDirection(key);
    });
    $(".compass-direction-create").button({
        icons: { primary: "ui-icon-plusthick" }
    }).click(function () {
        var key = $(this).attr("data-key");
        var direction = $("input:radio[name=" + key + "-compass]:checked");
        var to = $("#" + key + "-exit-data-create-to option:selected").val();
        var directionName = direction.attr("data-name");
        var inverse = direction.attr("data-inverse");
        var type = direction.attr("data-type");
        var inverseType = direction.attr("data-inversetype");
        var createInverse = $("#" + key + "-exit-data-create-inverse").is(":checked");
        if (createInverse) {
            sendAdditionalAction("exits create2 " + to + ";" + directionName + ";" + type + ";" + inverse + ";" + inverseType);
        }
        else {
            sendAdditionalAction("exits create1 " + to + ";" + directionName + ";" + type);
        }
    });

    var enabledButtons = $("#_enabledButtons").val();
    updateEnabledButtons(enabledButtons);

    var popupError = $("#_popupError").val();
    if (popupError.length > 0) {
        var reload = $("#_reload").val();
        if (reload == "1") {
            $("#dialog-error").data("dialog_close", function () {
                location.reload();
            });
        }
        $("#dialog-error-message").html(popupError);
        $("#dialog-error").dialog("open");
    }
}

function setSelectedDirection(key) {
    var selected = $("input:radio[name=" + key + "-compass]:checked");
    var value = selected.val();
    var name = selected.attr("data-name");
    var to = selected.attr("data-to");
    var elementId = selected.attr("data-id");
    $("#" + key + "-exit-data").show();
    $("#" + key + "-exit-data-name").html(capFirst(name));
    if (elementId.length > 0) {
        $("#" + key + "-exit-data-to").html(to);
        $("#" + key + "-exit-data-edit").attr("data-key", elementId);
        $("#" + key + "-exit-data-create").hide();
        $("#" + key + "-exit-data-existing").show();
    }
    else {
        $("#" + key + "-exit-data-existing").hide();
        $("#" + key + "-exit-data-create").show();
    }
}

function getSelectedScripts(key) {
    return getSelectedItems(key, ".script-select", 10);
}

function getSelectedIfSections(key) {
    return getSelectedItems(key, ".ifsection-select", 17);
}

function getSelectedScriptDictionaryItems(key) {
    return getSelectedItems(key, ".scriptDictionarySection-select", 18);
}

function getSelectedItems(key, checkboxClass, prefixLength) {
    var result = "";
    $(checkboxClass).each(function (index, element) {
        var e = $(element);
        var id = e.attr("id");
        var checkboxKey = e.attr("data-key");
        if (checkboxKey == key && e.is(":checked")) {
            if (result.length > 0) result += ";";
            result += id.substring(prefixLength + key.length);
        }
    });
    return result;
}

function stringListEdit(key, prompt) {
    var selectElement = $("#select-" + key + " option:selected");
    var oldValue = selectElement.text();
    showDialog(prompt, oldValue, function (newValue) {
        if (oldValue != newValue) {
            sendAdditionalAction("stringlist edit " + key + ";" + selectElement.val() + ";" + newValue);
        }
    })
}

function sendAdditionalAction(action) {
    $("#_additionalAction").val(action);
    $("#_additionalActionTab").val($("#elementEditorTabs").tabs('option', 'selected'));
    $("#elementEditorSave").submit();
}

function updateEnabledButtons(buttons) {
    var enabledButtons = buttons.split(";");
    updateButton(enabledButtons, "undo", $("#button-undo"));
    updateButton(enabledButtons, "redo", $("#button-redo"));
    updateButton(enabledButtons, "delete", $("#button-delete"));
    updateButton(enabledButtons, "cut", $("#button-cut"));
    updateButton(enabledButtons, "copy", $("#button-copy"));
    updateButton(enabledButtons, "paste", $("#button-paste"));
}

function updateButton(enabledButtons, label, button) {
    if ($.inArray(label, enabledButtons) == -1) {
        button.button("disable");
    }
    else {
        button.button("enable");
    }
}

function ajaxError() {
    $("#dialog-error").data("dialog_close", function () {
        location.reload();
    });
    $("#dialog-error-message").html("Sorry, an internal error occurred.");
    $("#dialog-error").dialog("open");
}

function addNewElement(elementType, objectType, filter) {
    switch (elementType) {
        case "object":
            switch (objectType) {
                case "object":
                    addNewObject();
                    break;
                case "exit":
                    alert("To do: exit");
                    break;
                case "command":
                    if (filter == "verb") {
                        alert("To do: verb");
                    }
                    else {
                        alert("To do: command");
                    }
                    break;
                default:
                    alert("Unhandled: " + objectType);
                    break;
            }
            break;
        case "function":
        case "timer":
        case "walkthrough":
        case "include":
        case "template":
        case "dynamictemplate":
        case "type":
        case "javascript":
            alert("To do: " + elementType);
            break;
        default:
            alert("Unhandled: " + elementType);
            break;
    }
}

function addNewRoom() {
    showDialog("Please enter a name for the new room", "", function (text) {
        toplevelAdditionalAction("main addroom " + text);
    });
}

function addNewObject() {
    var possibleParents = $("#_newObjectPossibleParents").val().split(";");
    showDialog("Please enter a name for the new object", "", function (text, parent) {
        toplevelAdditionalAction("main addobject " + text + ";" + parent);
    }, possibleParents, "Parent");
}

function selectTreeNode(node) {
    $("#gameTree").jstree("deselect_all");
    $("#gameTree").jstree("select_node", "#tree-" + node.replace(/ /g, "-"));
}

function capFirst(text) {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
}