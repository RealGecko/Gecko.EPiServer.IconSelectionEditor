define([
    "dojo/_base/declare",
    "dojo/string",
    "dojo/_base/array",
    "dojo/_base/lang",
    "dojox/html/entities",
    "epi-cms/contentediting/editors/SelectionEditor",
    "dijit/MenuBarItem",
    "dijit/MenuSeparator"
],
    function (declare, string, array, lang, entities, SelectionEditor, MenuBarItem, MenuSeparator) {
        return declare("gecko/IconSelectionEditor", [SelectionEditor], {
            buildRendering: function () {
                this.inherited(arguments);

                this.domNode.classList.add('geckoIconSelectionEditorDropdown');
                this.dropDown.domNode.classList.add('geckoIconSelectionEditorGrid');
            },
            _setSelectionsAttr: function (newSelections) {
                this.set("options", array.map(newSelections, function (item) {
                    return {
                        label: item.value.htmlString,
                        value: item.text,
                        selected: (item.value === this.value) || (!item.value && !this.value)
                    };
                }, this));
            },
            _onDropDownMouseDown: function () {
                this.inherited(arguments);

                if (this.params.selectionGridWidth) {
                    this.dropDown.domNode.style.maxWidth = this.params.selectionGridWidth;
                }
            },
            _getMenuItemForOption: function (option) {
                var item = null;
                if (option.type === "separator") {
                    item = new MenuSeparator();
                } else {
                    var click = lang.hitch(this, "_setValueAttr", option);
                    item = new MenuBarItem({
                        option: option,
                        label: option.label || this.emptyLabel,
                        onClick: click,
                        disabled: option.disabled || false
                    });
                    item.focusNode.setAttribute("role", "listitem");
                }
                this.own(item);
                return item;
            }
        });
    });