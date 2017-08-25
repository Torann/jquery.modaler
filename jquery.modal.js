/**
 * @file jquery.modal.js
 * @copyright 2015-2017 Lulebe, Inc.
 * @author Daniel Stainback (Torann)
 * @url https://github.com/Torann/jquery.modaler
 * @version 1.0.0
 * @license Apache-2.0
 */

+function ($) { "use strict";

    // MODAL CLASS DEFINITION
    // ======================

    var Modal = function (element, options) {
        this.options = $.extend({}, Modal.DEFAULTS, options);
        this.isActive = false;
        this.$element = $(element);

        // Append virtual elements
        if (this.$element.length && this.$element.parent().length == 0) {
            this.$element.appendTo('body');
        }
    };

    Modal.DEFAULTS = {
        action: 'toggle',
        destroyOnClose: false,
        primaryContent: '.modal-content',
        activeClass: 'modal-is-active',
        inactiveClass: 'modal-is-inactive',
        aboveClass: 'modal-is-above',

        // Close button
        backdropCloseEnabled: true,
        closeBtnSelector: '[data-modal-close]',

        // Fullscreen mode
        isFullScreen: false,

        // Form options
        onSubmit: null,
        reload: false,
        clearform: false
    };

    Modal.prototype.toggle = function (_relatedTarget) {
        return this[!this.isActive ? 'show' : 'hide'](_relatedTarget)
    };

    Modal.prototype.show = function (ev, data) {
        ev && ev.preventDefault();

        var that = this;

        // Before Event
        if (this.options.beforeShow && this.options.beforeShow(ev, data) === false) {
            return;
        }

        // Close logic
        this.$element.find(this.options.closeBtnSelector).on('touchstart click', this.close.bind(this));

        if (this.options.isFullScreen) {
            this.$element.addClass('modal-fullscreen');
        }

        this.$element
            .removeClass(this.options.inactiveClass)
            .addClass(this.options.activeClass)
            .addClass(this.options.aboveClass)
            .css({
                zIndex: parseInt(this.$element.css('zIndex')) + $('.modal.' + this.options.activeClass).length
            });

        $('html').addClass(this.options.activeClass);

        this.isActive = true;

        // Trigger event
        this.$element.trigger('modal.opened');

        $(window).trigger('modal.opened', {
            modalSelector: this.$element
        });

        // Bind form
        this.$form = this.$element.find('form').on('submit', function(ev) {
            if (typeof that.options.onSubmit === 'function') {
                return that.options.onSubmit(ev, that.$form);
            }

            return that.submit(ev);
        });

        // Focus on element
        setTimeout(function () {
            that.$form.find('[focus=true]').focus();
        }, 2);

        // Forms are important, so don't close
        if (this.options.backdropCloseEnabled && this.$form.length === 0) {
            $(document).on('touchstart click', this.closeBackdrop.bind(this));
        }

        // After Event
        if (this.options.afterShow) this.options.afterShow(ev, data);

        // Disable full page scrolling
        if (typeof($.fn.fullpage) === 'function') $.fn.fullpage.setAllowScrolling(false);
    };

    Modal.prototype.submit = function (ev) {
        ev && ev.preventDefault();

        var that = this;

        return this.$form.ajaxSubmit({
            clearForm: this.options.clearform,
            beforeSubmit: function(arr, $form) {
                $.toggleLoader(1);

                // Disable inputs
                that.$form.find('input,textarea,button[type="submit"]').toggleProp('disabled', true);
            },
            success: function(data, status, xhr) {
                // TODO: remove this after beta launch
                if (data.message) {
                    $.snackbar({
                        message: data.message,
                        style: 'success'
                    });
                }

                that.$element.trigger('ajax.success');

                if (data.redirect) {
                    window.location = data.redirect;
                }
                else if (that.options.reload) {
                    window.location.reload();
                    return;
                }

                that.close();
            },
            complete: function(xhr, status) {
                $.toggleLoader(0);

                // Enable inputs
                that.$form.find('input,textarea,button[type="submit"]').toggleProp('disabled', false);

                that.$element.trigger('ajax.complete');
            }
        });
    };

    Modal.prototype.close = function (ev, data) {
        ev && ev.preventDefault();

        // Prevent dup closes
        if (this.isActive === false) return;

        // Before Event
        if (this.options.beforeClose && this.options.beforeClose(ev, data) === false) {
            return;
        }

        this.$element
            .removeClass(this.options.aboveClass)
            .removeClass(this.options.activeClass)
            .addClass(this.options.inactiveClass)
            .css({
                zIndex: ''
            });

        $('html').removeClass(this.options.activeClass);

        // Remove adjusted z-index
        this.$element.css({
            zIndex: ''
        });

        this.isActive = false;

        this.$form.off('submit');

        // After Event
        if (this.options.afterClosed) this.options.afterClosed(ev, data);

        // Enable full page scrolling
        if (typeof($.fn.fullpage) === 'function') $.fn.fullpage.setAllowScrolling(true);

        // Remove everything
        if (this.options.destroyOnClose === true) {
            setTimeout(this.destroy.bind(this), 300)
        }
    };

    Modal.prototype.closeBackdrop = function (ev) {
        var $target = $(ev.target);
        if ($target.is(this.$element) && $target.closest(this.options.primaryContent).length === 0) {
            this.close(ev);
        }
    };

    Modal.prototype.destroy = function () {
        this.$form.off('submit');
        $(document).off('touchstart click', this.closeBackdrop.bind(this));

        // Remove modal
        this.$element.remove();
    };


    // MODAL PLUGIN DEFINITION
    // =======================

    $.fn.modal = function (option, _relatedTarget, data) {
        return this.each(function () {
            var $this    = $(this);
            var instance = $this.data('of.modal');
            var options  = typeof option == 'object' && option;

            if (!instance) $this.data('of.modal', (instance = new Modal(this, options)));

            if (typeof option == 'string') instance[option](_relatedTarget, data);
            else if (instance.options.action) instance[instance.options.action](_relatedTarget, data);
        })
    };

    $.fn.modal.Constructor = Modal;


    // MODAL DATA-API
    // ==============

    $(document).on('click.of.modal.data-api', '[data-modal]', function (ev) {
        var $this   = $(this);
        var $target = $($this.data('modal'));
        var option  = $target.data('of.modal') ? 'toggle' : $.extend({}, $target.data(), $this.data());

        ev && ev.preventDefault();

        $target.modal(option, ev);
    });

}(window.jQuery);
