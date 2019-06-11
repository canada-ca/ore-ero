# How to use

Documentation about Template for form pages.

```yaml
---

id: 'string' # The name of the top level id in the translation _data/i18n/form.yml (one per type of form) REQUIRED

fieldgroups:              # [Array] of groups and fields
  - preset: 'string'      # One of the presets already made (see list below for available presets) REQUIRED
  - widget: 'string'      # The widget type of the fieldgroup (see list below for available widgets) REQUIRED
    title: 'string'       # The id of the fieldgroup (must be unique) REQUIRED
    type: 'string'        # The type of input OPTIONAL - Default: text
    required: boolean     # If the field is required or not OPTIONAL - Default: true
  rule: 'string'          # The id of the special rule for input validation (see _data/forms/rules.yml) OPTIONAL - Default: none
    fields:               # [Array] of fields (use it with the group widget) OPTIONAL - Default: nil
      - widget: 'string'  # Same as above
      - ...
```

## Presets

List of presets:
 - components/email
 - adminCode
 - contact
 - dates
 - description
 - languages
 - licenses
 - schemaVersion
 - status
 - submitter
 - tags

**components/email**

The reccuring basic email field.

**adminCode**

Select field for the associated admin code (see the list in `_data/administrations/*.yml`).

**contact**

A group of fields for the preferred contact for the project.

**dates**

A group of fields for the created, last modified and last updated dates.

**description**

A very simple duo of fields for the description (english and french) of the current element.

**languages**

A checklist of the programming languages associated with the code form.

**licenses**

A group of fields for the EN & FR license url and the spdxID name.

**schemaVersion**

The readonly schema version of the form.

**status**

A dropdown menu for the version of the current element (alpha, beta, maintained, deprecated, retired).

**submitter**

A group of fields for the info about the submitter.

## Widgets

List of widgets
 - group
 - string
 - string-i18n (Two text inputs, one for EN and the other one for FR)

**group**

Used for a number of fields that are logically grouped together under a same title. Must use `fields` to fill the group with elements.

**string**

A single input under a title.
When used with the group widget, no title is included, only the field (otherwise there would be a duplicate of title).

**string-i18n**

Two input under a title. Used when a same value needs to be translated in english and french (i.e. descEN and descFR).
When used with the group widget, no title is included, only the fields (otherwise there would be a duplicate of title).
