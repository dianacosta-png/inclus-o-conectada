# Project conventions

- Decap custom widgets use React style objects, not CSS strings, because Decap's `h` renders React elements.
- Initialize Decap after registering custom widgets; upload gallery media through its authenticated Git Gateway backend so provider selection and token refresh match native media uploads.