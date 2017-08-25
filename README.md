# jQuery Modals

Not that the jQuery world needed another modal plugin. Make sure to read the *requirements* at the bottom.

## Getting Started

You can install the plugin using Bower:

```bash
bower install jquery.modaler
```

The plugin comes with a simple SASS file for styling the modals.

**Include files**

```html
<link href="modal.min.css" type="text/css" rel="stylesheet">
<script src="jquery.modal.js"></script>
```

## Basic use

### Automatically attaching

The simplest approach is to add `data-modal` to your desired element and use the attribute's value to specify modal to open.

```html
<div id="modal-id" class="modal">
  ...
</div>

<a data-modal="#modal-id">Open Modal</a>
```

## Options

 - `action` - this is used to show, hide, or toggle the modal  (default `toggle`)
 - `destroyOnClose` - remove the modal after closing. Useful for dynamic modals. (default `false`)
 - `primaryContent` - this is the selector for the primary content. (default `.modal-content`)
 - `activeClass` - modal active class added to the modal and body tag. (default `modal-is-active`)
 - `inactiveClass` - modal inactive class added to the modal. (default `modal-is-inactive`)
 - `aboveClass` - modal above active class added to the modal once fully visible (default `modal-is-above`)

### Close button

 - `backdropCloseEnabled` - clicking on the backdrop closes the modal. (default `true`)
 - `closeBtnSelector` - selector used to close the modal. Must be within the modal. (default `[data-modal-close]`)

### Form options

 - `onSubmit` - Callback for onsubmit event. (default `null`)
 - `reload` - Reload the page after submitting. (default `false`)
 - `clearform` - Clear the form after submitting. (default `false`)


## Manual Use

```js
var $instance = $('#magic-modal').modal({
    action: null,
    afterClosed: function(ev) {
        ev && ev.preventDefault();

        // Some action
    },
    onSubmit: function(ev, $form) {
        ev && ev.preventDefault();

        // Some form action
    },
});

// Open modal
$instance.modal('show');

// Hide modal
$instance.modal('hide');


// Toggle modal
$instance.modal('toggle');
```

### Dynamic Modal

Doing this, the plugin will automatically append the modal to the DOM and carry-on as usual.

```js
var $instance = $('<div class="modal" data-effect="scale" data-size="s">Some modal content stuff</div>').modal();
```

> You may wish to use the `destroyOnClose: true` option here

## Big Example

**Modal Trigger HTML**

```html
<a data-modal="#settings-modal" data-reload="true" aria-label="Update your settings">
    Update Settings
</a>
```

**Modal HTML**

```html
<div class="modal" id="settings-modal" data-effect="scale" data-size="s">
    <div class="modal-content">
        <header>
            <a class="modal-close" data-modal-close="true"></a>
            Update your settings
        </header>
        <div class="modal-body">
            <form role="form" method="POST" action="/path/to/preferences">
                <div class="input-field">
                    <label for="user-region">
                        Region
                    </label>
                    <select id="user-region" name="region">
                        <option value="36">
                            Mexico
                        </option>
                        <option value="195" selected>
                            United States
                        </option>
                    </select>
                </div>

                <div class="input-field">
                    <label for="user-language">
                        Language
                    </label>
                    <select id="user-language" name="locale">
                        <option value="en" selected>
                            English
                        </option>
                        <option value="es">
                            español
                        </option>
                    </select>
                </div>

                <div class="input-buttons">
                    <button type="submit">
                        Update
                    </button>
                </div>
            </form>
        </div>
    </div>
</div>
```

## Requirements

 - [jquery.form](http://malsup.com/jquery/form)

This helper function toggles an on page load indicator.

```
$.toggleLoader(int) // Int: 1 = show, 0 = hide
```