# How to use

Documentation about Template for form pages.

## Page instructions
Add a file with the following specifications in the jekyll header. Where `[name]` is the unique id of the form.

```yaml
---
layout: form
config: config-[name]
---
```

## Config instructions
Create a new file `_data/forms/config-[name].yml` and fill it using the instructions below.

```yaml
---

id: 'string'              # use the same [name] that you added in the page header for config.

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
    options:              # [Array] of options (use it with the select widget) OPTIONAL - Default: nil
      - value: 'string'   # The value of the option .val() & The label id for traduction (from _data/i18n/form/[id][title].options[label])
```

### Presets
Presets are widgets that follow a specific format and parameters, they are meant to be used as is. They're also meant for a same component that can be used between different forms without modification.

List of presets:
 - adminCode
 - contact
 - dates
 - description
 - languages
 - licenses
 - orgLevel
 - schemaVersion
 - tags

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

**orgLevel**

A select field (Federal, Provincial, Municipal) for use in admin code form.

**schemaVersion**

The readonly schema version of the form.

**tags**

A list of tag fields for the code form.

### Widgets
Widgets are generic components.

List of widgets
 - group
 - select
 - string
 - string-i18n

**group**

Used for a number of fields that are logically grouped together under a same title. Must use `fields` to fill the group with elements.

**select**

A select input. Must add `options` field to widget.

**string**

A single input under a title.
When used with the group widget, no title is included, only the field (otherwise there would be a duplicate of title).

**string-i18n**

Two input under a title. Used when a same value needs to be translated in english and french (i.e. descEN and descFR).
When used with the group widget, no title is included, only the fields (otherwise there would be a duplicate of title).

### Translations instructions
In the file `_data/i18n/form.yml`, add the translations specific to the new widgets.
 - If you create a new preset, add it in the `preset` top-level element.
 - Otherwise, add a new top-level element using the same name as you added in page `[name]` and in config `id`
 - Then, for each widget, add a sub-element using `title`.

**For a group widget, follow this template**
```yaml
name: # The [name] used in page config
  Title: # The [title] used in the widget config
    title:
      en: The english title
      fr: The french title
    label:
      en: The english label
      fr: The french label
    options:
      option no1: # One for each options
        en: The english option no.1
        fr: The french option no.1
      option no2:
        en: The english option no.2
        fr: The french option no.2
      ...
```

**For a select widget, follow this template**
```yaml
name: # The [name] used in page config
  Title: # The [title] used in the widget config
    title:
      en: The english title
      fr: The french title
    labels:
      Title no1: # One for each fields.title
        en: The english label no.1
        fr: The french title no.1
      Title no2:
        en: The english label no.2
        fr: The french label no.2
      ...
```

**For a string widget, follow this template**
```yaml
name: # The [name] used in page config
  Title: # The [title] used in the widget config
    title:
      en: The english title
      fr: The french title
    label:
      en: The english label
      fr: The french label
```

**For a string-i18n widget, follow this template**
```yaml
name: # The [name] used in page config
  Title: # The [title] used in the widget config
    title:
      en: The english title
      fr: The french title
    label:
      en:
        en: The english label in english
        fr: The french title in english
      fr:
        en: The english label in french
        fr: The french label in french
```
