define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/sniff",
    "dojox/html/entities",
    "epi-cms/contentediting/editors/SelectionEditor",
    "dijit/MenuBarItem",
    "dijit/MenuSeparator"
],
    function (declare, lang, has, entities, SelectionEditor, MenuBarItem, MenuSeparator) {
        return declare("gecko/IconSelectionEditor", [SelectionEditor], {
            buildRendering: function () {
                this.inherited(arguments);

                this.domNode.classList.add('geckoIconSelectionEditorDropdown');
                this.dropDown.domNode.classList.add('geckoIconSelectionEditorGrid');
            },
            openDropDown: function () {
                // For some reason, dropdown width is different for first and later openings.
                // Setting overflow before calling base method fixes this issue.
                this.dropDown.domNode.style.overflow = 'auto';

                this.inherited(arguments);

                // Fix for incorrect grid width on firefox.
                if (has('ff')) {
                    this.dropDown.domNode.style.width = Math.ceil(parseInt(this.dropDown.domNode.style.width) / 5) * 5 + 'px';
                }

                if (this.params.selectionGridWidth) {
                    this.dropDown.domNode.style.maxWidth = this.params.selectionGridWidth;
                }
            },
            _setSelectionsAttr: function (newSelections) {

                this.set("options", newSelections.flatMap(function (item, index) {
                    var result = [];

                    if (this.params.iconsPerRow > 0 && index % this.params.iconsPerRow == 0) {
                        result.push({ type: "separator" });
                    }

                    result.push({
                        label: item.value.htmlString,
                        value: item.text,
                        selected: (item.value === this.value) || (!item.value && !this.value)
                    });

                    return result;
                }, this));
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