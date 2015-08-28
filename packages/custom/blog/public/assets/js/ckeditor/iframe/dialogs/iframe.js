/* jshint ignore:start */

/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or http://ckeditor.com/license
 */

'use strict';

(function () {
    var select;

    function loadValue(iframeNode) {
        var isCheckbox = this instanceof CKEDITOR.ui.dialog.checkbox;
        if (iframeNode.hasAttribute(this.id)) {
            var value = iframeNode.getAttribute(this.id);
            this.setValue(value);
        }
    }

    function commitValue(iframeNode) {
        var isRemove = this.getValue() === '',
            value = this.getValue();
        if (isRemove)
            iframeNode.removeAttribute(this.att || this.id);
        else
            iframeNode.setAttribute(this.att || this.id, value);

        iframeNode.setAttribute('fullscreen', 'true');
        iframeNode.setAttribute('allowfullscreen', 'true');
        iframeNode.setAttribute('mozallowfullscreen', 'true');
        iframeNode.setAttribute('webkitallowfullscreen', 'true');
        iframeNode.setAttribute('scrolling', 'no');
    }

    CKEDITOR.dialog.add('iframe', function (editor) {
        var iframeLang = editor.lang.iframe,
            commonLang = editor.lang.common,
            dialogadvtab = editor.plugins.dialogadvtab;
        return {
            title: iframeLang.title,
            minWidth: 350,
            minHeight: 100,
            onShow: function () {
                // Clear previously saved elements.
                this.fakeImage = this.iframeNode = null;

                var fakeImage = this.getSelectedElement();
                if (fakeImage && fakeImage.data('cke-real-element-type') && fakeImage.data('cke-real-element-type') == 'iframe') {
                    this.fakeImage = fakeImage;

                    var iframeNode = editor.restoreRealElement(fakeImage);
                    this.iframeNode = iframeNode;

                    this.setupContent(iframeNode);
                }


            },
            onOk: function () {
                var iframeNode;
                if (!this.fakeImage)
                    iframeNode = new CKEDITOR.dom.element('iframe');
                else
                    iframeNode = this.iframeNode;

                // A subset of the specified attributes/styles
                // should also be applied on the fake element to
                // have better visual effect. (#5240)
                var extraStyles = {},
                    extraAttributes = {};
                this.commitContent(iframeNode, extraStyles, extraAttributes);

                // Refresh the fake image.
                var newFakeImage = editor.createFakeElement(iframeNode, 'cke_iframe', 'iframe', true);
                newFakeImage.setAttributes(extraAttributes);
                newFakeImage.setStyles(extraStyles);
                if (this.fakeImage) {
                    newFakeImage.replace(this.fakeImage);
                    editor.getSelection().selectElement(newFakeImage);
                } else
                    editor.insertElement(newFakeImage);
            },
            contents: [
                {
                    id: 'info',
                    label: commonLang.generalTab,
                    accessKey: 'I',
                    elements: [
                        {
                            id: 'src',
                            type: 'select',
                            requiredContent: 'iframe[src]',
                            default: '',
                            items: [],
                            style: 'width:100%',
                            labelLayout: 'vertical',
                            label: 'Video',
                            onLoad: function (ele) {
                                select = this;
                                $.ajax({
                                    url: '/api/blog/video/dropdown',
                                    dataType: 'json',
                                    async: false,
                                    success: function (data) {
                                        for (var i in data) {
                                            select.add(data[i].title, '/blog/player/' + data[i]._id + '/320/240');
                                        }
                                    }
                                });
                            },
                            setup: function (iframeNode, fakeImage) {
                                loadValue.apply(this, arguments);
                                if (fakeImage) {
                                    var fakeImageAlign = fakeImage.getAttribute('src');
                                    this.setValue(fakeImageAlign && fakeImageAlign.toLowerCase() || '');
                                }
                            },
                            commit: function (iframeNode, extraStyles, extraAttributes) {
                                commitValue.apply(this, arguments);
                                if (this.getValue()) {
                                    extraAttributes.align = this.getValue();
                                }
                            }
                        }
                    ]
                },
                dialogadvtab && dialogadvtab.createAdvancedTab(editor, {id: 1, classes: 1, styles: 1}, 'iframe')
            ]
        };
    });
})();
