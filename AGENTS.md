# Project conventions

- Decap custom widgets use React style objects, not CSS strings, because Decap's `h` renders React elements.
- Initialize Decap after registering custom widgets; upload gallery media via the widget's `onPersistMedia` prop with the field's `media_folder`/`public_folder` so files commit with the entry exactly like native image uploads.
- Field-level `media_folder` values in the admin config start with `/` because Decap resolves relative ones against the content file's folder.