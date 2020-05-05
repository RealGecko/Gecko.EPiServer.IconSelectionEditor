define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojox/html/entities",
    "epi-cms/contentediting/editors/SelectionEditor",
    "dijit/MenuBarItem",
    "dijit/MenuSeparator",
    "dijit/popup"
],
    function (declare, lang, array, entities, SelectionEditor, MenuBarItem, MenuSeparator, Popup) {
        return declare("gecko/IconSelectionEditor", [SelectionEditor], {
            buildRendering: function () {
                this.inherited(arguments);

                this.domNode.classList.add('geckoIconSelectionEditorDropdown');
                this.dropDown.domNode.classList.add('geckoIconSelectionEditorGrid');

                if (this.params.requireClientResources) {
                    require(this.params.requireClientResources);
                }
            },
            openDropDown: function () {
                // For some reason, dropdown width is different for first and later openings.
                // Setting overflow before calling base method fixes this issue.
                this.dropDown.domNode.style.overflow = 'auto';

                if (this.params.selectionGridWidth) {
                    this.dropDown.domNode.style.maxWidth = this.params.selectionGridWidth;
                }
                else if (this.params.iconsPerRow && this.params.iconsPerRow > 0) {
                    // Calculate table width to fit number of icons in a row.
                    Popup.moveOffScreen(this.dropDown);

                    if (this.dropDown.startup && !this.dropDown._started) {
                        this.dropDown.startup();
                    }

                    var style = this.dropDown.menuTableNode.currentStyle || window.getComputedStyle(this.dropDown.menuTableNode),
                        margin = parseFloat(style.marginLeft) + parseFloat(style.marginRight),
                        padding = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight),
                        border = parseFloat(style.borderLeftWidth) + parseFloat(style.borderRightWidth),
                        requiredWidth = margin + padding + border + (Math.ceil(this.dropDown.getChildren()[0].domNode.getBoundingClientRect().width) * this.params.iconsPerRow);

                    this.dropDown.menuTableNode.style.maxWidth = requiredWidth + 'px';
                }

                this.inherited(arguments);
            },
            _setSelectionsAttr: function (newSelections) {
                this.set("options", array.map(newSelections, function (item) {
                    return {
                        label: item.value.htmlString,
                        value: item.value.name,
                        icon: item.value,
                        selected: item.value === this.value || !item.value && !this.value
                    };
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