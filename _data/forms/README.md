# How to use

template for forms.

```yaml
---

id: 'string' # The name of the top level id in the translation _data/i18n/form.yml (one per type of form) REQUIRED

fieldgroups: # [Array] of groups and fields
  - preset: 'string' # One of the presets already made (see list below for available presets) REQUIRED
  - widget: 'string' # The widget type of the fieldgroup (see list below for available widgets) REQUIRED
    title: 'string' # The id of the fieldgroup (must be unique) REQUIRED
    type: 'string' # The type of input OPTIONAL - Default: text
    required: boolean # If the field is required or not OPTIONAL - Default: true
    rule: 'string' # The id of the special rule for input validation (see _data/forms/rules.yml) OPTIONAL - Default: none
    fields: # [Array] of fields (use it whit the group widget) OPTIONAL - Default: nil
      - widget: 'string' # Same as above
      - ...
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
