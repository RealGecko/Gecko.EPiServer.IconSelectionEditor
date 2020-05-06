define([
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/_base/array",
    "dojo/on",
    "dojox/html/entities",
    "epi-cms/contentediting/editors/SelectionEditor",
    "dijit/MenuBarItem",
    "dijit/MenuSeparator",
    "dijit/popup",
    "dijit/form/TextBox",
],
    function (declare, lang, array, on, entities, SelectionEditor, MenuBarItem, MenuSeparator, Popup, TextBox) {
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

        function getCssClass(name) {
            return 'geckoIconSelectionEditor' + name;
        }

        return declare("gecko/IconSelectionEditor", [SelectionEditor], {
            buildRendering: function () {
                this.inherited(arguments);

                this.dropDown.searchTextBox = new TextBox({
                    placeHolder: 'Filter icons...',
                    intermediateChanges: true
                });

                this.dropDown.menuTableNode.createTHead().insertRow(0).insertCell(0).appendChild(this.dropDown.searchTextBox.domNode);

                this.domNode.classList.add(getCssClass('Dropdown'));
                this.dropDown.domNode.classList.add(getCssClass('Grid'));

                if (this.params.requireClientResources) {
                    require(this.params.requireClientResources);
                }
            },
            postCreate: function () {
                this.inherited(arguments);

                // Override item hover behavior so text box won't lose focus when item in the table is hovered.
                this.dropDown.onItemHover = function (item) {
                    if (this.focusedChild && this.focusedChild !== item) {
                        this.focusedChild._setSelected(false);
                        this.focusedChild.focused = false;
                        this.focusedChild._setStateClass();
                        this.focusedChild = null;
                    }

                    this._hoveredChild = item;
                    item._set("hovering", true);
                }

                var that = this;

                this.dropDown.searchTextBox.on('change', function () {
                    var items = that.dropDown.getChildren();
                    var filter = this.value.toLowerCase();

                    function nameOrKeyWordsStartsWithFilter(option) {
                        return option.details.name.toLowerCase().startsWith(filter) ||
                            array.some(option.details.keyWords, function (item) { return item.toLowerCase().startsWith(filter); }, this);
                    }

                    array.forEach(items, function (item) {
                        if (item.option && nameOrKeyWordsStartsWithFilter(item.option)) {
                            item.domNode.style.display = "inline-block";
                        } else {
                            item.domNode.style.display = "none";
                        }
                    });
                });
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
                    this.dropDown.searchTextBox.domNode.style.width = getWidthForDropDownTableElement(this.dropDown) * this.params.iconsPerRow + 'px';
                }

                this.inherited(arguments);

                if (hasIconsPerRowConfigured) {
                    // Override values set by base method.
                    this.dropDown.domNode.style.overflowX = "hidden";
                    this.dropDown.menuTableNode.style.width = widthForTable + 'px';
                }
            },
            closeDropDown: function () {
                this.inherited(arguments);

                this.dropDown.searchTextBox.set('value', null);
            },
            _setSelectionsAttr: function (newSelections) {
                this.set("options", array.map(newSelections, function (item) {
                    return {
                        label: item.value.htmlString,
                        value: item.value.id,
                        details: item.value,
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