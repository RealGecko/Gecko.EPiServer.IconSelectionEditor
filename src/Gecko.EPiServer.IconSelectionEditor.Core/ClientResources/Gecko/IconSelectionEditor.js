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
        function getWidthForDropDownTableElement(dropDown) {
            return dropDown.getChildren()[0].domNode.getBoundingClientRect().width;
        }

        function getWidthForDropDownTable(dropDown, iconsPerRow) {
            var iconWidth = getWidthForDropDownTableElement(dropDown);

            var tableStyle = dropDown.menuTableNode.currentStyle || window.getComputedStyle(dropDown.menuTableNode),
                tableMargin = parseFloat(tableStyle.marginLeft) + parseFloat(tableStyle.marginRight),
                tablePadding = parseFloat(tableStyle.paddingLeft) + parseFloat(tableStyle.paddingRight),
                tableBorder = parseFloat(tableStyle.borderLeftWidth) + parseFloat(tableStyle.borderRightWidth);

            return Math.ceil(tableMargin + tablePadding + tableBorder + (iconWidth * iconsPerRow));
        }
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
                var hasIconsPerRowConfigured = this.params.iconsPerRow && this.params.iconsPerRow > 0;
                var widthForTable = null;

                // For some reason, dropdown width is different for first and later openings.
                // Setting overflow before calling base method fixes this issue.
                this.dropDown.domNode.style.overflow = 'auto';

                if (this.params.selectionGridWidth) {
                    this.dropDown.domNode.style.maxWidth = this.params.selectionGridWidth;
                }

                if (hasIconsPerRowConfigured) {
                    // Calculate table width to fit number of icons in a row.
                    Popup.moveOffScreen(this.dropDown);

                    if (this.dropDown.startup && !this.dropDown._started) {
                        this.dropDown.startup();
                    }

                    var widthForTable = getWidthForDropDownTable(this.dropDown, this.params.iconsPerRow);

                    this.dropDown.menuTableNode.style.width = widthForTable + 'px';
                }

                this.inherited(arguments);

                if (hasIconsPerRowConfigured) {
                    // Override values set by base method.
                    this.dropDown.domNode.style.overflowX = "hidden";
                    this.dropDown.menuTableNode.style.width = widthForTable + 'px';
                }
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