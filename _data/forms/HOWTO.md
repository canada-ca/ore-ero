# How to use

template for forms.

```
---
fieldgroups: # [Array] of groups and fields
  - preset: 'string' # One of the presets already made
  - widget: 'string' # The widget type of the fieldgroup
    title: 'string' # The id of the fieldgroup (must be unique)
    fields: # [Array] of fields
      - widget: 'string' # The widget type of the fieldgroup
      - title: 'string' # The id of the field (must be unique)
```

List of presets:
 - adminCode
 - contact
 - dates
 - description
 - languages
 - licenses
 - name
 - schemaVersion
 - status
 - submitter
 - tags

List of widgets
 - group (using fields, used to hierarchly group fields together under)
 - string (default single text input)
 - string-i18n (Two text inputs, one for EN and the other one for FR)
