# Solution for auto-generating forms and their associated schema
Inspired from the core principles of [Netlify Cms](https://www.netlifycms.org/), this system was built and adapted to better fit this project specificity.

The following documentation will attempt to explain how by using a simple `.yml` file, in concordance with the form and schema layouts as well as the translation documents in the `_data/i18n/` folder, the corresponding form and schema pages will be auto-generated. However, as of now, there a still some limits to the automatisation, and some javascript will still be required to make the forms work.

In this document are descriptions about how each element of this solution work, as well as instructions on how to use them, update them and even create new ones.

## Pages
Found under the `_pages/` folder, pages must follow the template below in order for them to pull all the data you will set up next.

**Warning** When creating or updating pages, make sure that you apply the changes in both languages! Find the corresponding pages in `_pages/en` and `_pages/fr`. Look for the pages that have the same `ref` value in their header.

In general, the pages have the following header variables that you must also include in any form of schema page (an example is provided at the end of the list):
 - `layout`: Defines which layout structure to follow. Layouts are defined in the `_layouts/` folder. Its default value is simply "default".
 -  `ref`: A id that must be unique between the pages but shared between the same page in the two languages. For instance, if you have an english index page and an french index page, both must have the same value for the `ref` variable, and no other pages other than these two must have index as their `ref` value. This is how the website know to which page to redirect when changing language, as the page might not have the same name in each languages.

> How is `ref` used? The way that language switching currently work is that when the pages are generated using Jekyll/Liquid, it looks for all the pages that have the same `ref` but a different `lang` value as the current page and add their link to the language switcher navbar.

 -  `lang`: The associated language of the page. Used mostly as `[page.lang]` throughout the templates, it serves as selecting the correct value for a translation. The accepted values are either `en` or `fr` (case is important).
 - `permalink`: The permalink for the page, will override the file location in the folders when the website is compiled. Follow the convention `/[lang]/[page name].html`.

**Header example for a normal page**
```yaml
---
layout: default
ref: example
lang: en
permalink: /en/example.html
---
```

### Form page
The form pages require a few more parameters:
 - `layout`: Form pages use "form" as their layout value instead of the default one.
 - `config`: Refers to the name of the Yaml file in `_data/forms/` associated with the current form. That's how the correspondance is made between the layout and the data for the form.

**Header example for a form page**
```yaml
---
layout: form
ref: exampleform
lang: en
permalink: /en/example-form.html
config: config-example
---
```

### Schema page
The schema pages uses the same parameters as the form pages, but its `layout` must be set to "schema". Also, the schema and form pages for a same form should share their value for `config`. That way, both can pull from the same data.

**Header example for a schema page**
```yaml
---
layout: schema
ref: exampleSchema
lang: en
permalink: /en/example-schema.html
config: config-example
---
```

## Layouts
Each of the form and schema pages pull from the same layouts.

### Form layout
Found under `_layouts/form.html` it inherits from the default layout as to include the header, footer and other fixed components of the website.

First, the content defined in the page using this layout is added, then comes the form.

The form itself has some classes and ids required for the form validation plugin (that comes with the [WET-BOEW](https://wet-boew.github.io/wet-boew/docs/ref/formvalid/formvalid-en.html) template), then we define the `idPresets` variable. This refers to the first-level group "presets" in the translation file and is declared here in order to be declared only once for the forms. Up next comes the piece de résistance, a `include` call to the form loop. That's where the template system looks for the values in the config file and includes the correct elements to the form.

Then the submitter file is included. The information about the submitter of the form (name and email) are required for the creation of the pull requests. Since we're currently using an anonymous bot to create the pull request, these informations allow us to keep track of who submitted the changes.

Finally, the submit and reset buttons are added to the form. Note that the submit button has a unique id corresponding to `prbotSubmit{{ page.ref }}` where `{{ page.ref }}` translates to the value you added to `ref` in the header of the page. This will come up later in the JavaScript files when binding the submit event to the button. It was added to better distinguish between the different submit function calls and to prevent errors. Following the buttons are the different alerts the form uses, improving the user experience.

All these elements are located in the layout instead of the page or config file since they should all appear in the form page regardless of which form the page is referring to.

### Schema layout
Found under `_layouts/schema.html` it inherits from the default layout as to include the header, footer and other fixed components of the website.

First, the content defined in the page using this layout is added. Then the loop for the schema is included. Nothing else is added to the schema pages.

## Config files
These files are the backbone of this solution. They specify each components and their parameters that must be included in the form and schema associated with each one of them.

Here's an example file with default values:

 - `~` represents an undefined default value
 - Every value is a string, unless specified otherwise using comments
	 - `# enum()` means that there are specific values for this field
 - The list for every available presets and widgets are specified later
	 - Certain presets and most widgets have their own specific parameters and are explained later in their corresponding section
```yaml
---

id: example

formGroups:
  - preset: ~  # enum()
  - widget: ~  # enum()
    title: ~
    type: string
    rule: ~  # enum()
    required: true  # bool

```

### Presets
Found under `_includes[form/schema]/presets/`, presets are a set of (mostly) static sections that rarely take in parameters and should be used as is. Each preset was created for either of two purposes. The first is for when a section is called from two or more forms and it made more sense to have it predefined instead of having to  specify the same parameters to a widget twice. The second is when the section is too specific or doesn't fit in any of the widgets, either because it has some minor changes that would have been too specific to add as a parameter, or when the format is completely different from any widgets.

The following sections explain each of the available presets:
 - adminCode
 - contact
 - dates
 - description
 - empty
 - homepageURL
 - hr
 - languages
 - licenses
 - newAdmin
 - orgLevel
 - provinceSelect
 - relatedCode
 - selectCode, selectOss, and selectStandard
 - status
 - submitter
 - tags

#### adminCode
The adminCode preset displays a select field of administrations separated in groups for each level of government (federal, provincial, municipal, etc.). See the list of administrations in `_data/administrations/[level of gov.].yml`.

The select field is followed by a button that allows users to create a new administration, should they not find theirs in the list. The button opens a new section in the form containing the required fields for the creation of a new administration. For more informations on these fields, consult the **newAdmin** preset.

When selecting the appropriate administration (depending on the type of the form) JavaScript might be added to auto-fill the administration section of the form. This follows the same logic as for the **selectCode**, **selectOss**, and **selectStandards** presets.

This preset takes no additional parameters.

#### contact
The contact preset displays a group of fields for the contact information (url, email, name, phone) for the person responsible for the open source element this form refers to.

This preset takes one *optional* parameter:
 - `phone`: specifies if the phone field should be added or not. Its default value is `true`.
```yaml
  - preset: contact
    phone: true  # bool
```

#### dates
The date preset displays a group of fields for the dates relevant to the project; when the project was created, when was it started, when was its last modification, and when was its data on ore-ero last updated.

This preset takes three **required** parameters:
 - `created`: Specifies if the created date input should be added
 - `started`: Specifies if the started date input should be added
 - `modified`: Specifies if the last modified date input should be added
```yaml
  - preset: dates
    created: false  # bool
    started: false  # bool
    modified: false  # bool
```
These parameters are required because if you don't specify any, the date group will be empty except for the metadata last updated date input which is included by default and specifies when the project data was last updated. Its value is locked to today's date since the submitting of the form implies that the data was updated.

#### description
The description preset displays a duo of fields, one for the english and the other for the french description of the current projet. This preset was created because at least two of the forms made use of a description field.

This preset takes no additional parameters.

#### empty
The empty preset does not display anything in the form, but rather serves as a, [array] wrapper in the schema when there is a list of elements that are only updated as individual elements in the form. For instance, for the "release" array of the code schema (`_data/schemaCode.yaml`), it makes no sense to change the layout of the form to adapt to an array since only one release can be updated at a time. However, this should still be displayed as an array in the schema page.

This preset takes two **required** parameters:
 - `start` defines if this is the start of the end of the array element in the schema (decides to add either the 
beginning or the ending markup).
- `title` the name of the array element in the schema (also used for the translations, see the widget section for more informations)
```yaml
  - preset: empty
    start: false  # bool
    title: example
# Beginning a group / array
```
OR
```yaml
  - preset: empty
# Closing a group / array
```
The beginning and the ending markup are located under `_includes/schema/components/wrap_start.html` and `_includes/schema/components/wrap_start.html`. These are the files that show in the schema pages.

#### HomepageUrl
The homepageUrl preset displays a duo of fields, one for the english and the other for the french homepage URL of the current project. This preset was created because at least two of the forms made use of a homepage URL.

This preset takes no additional parameters.

#### hr
The hr preset is a simple `<hr>` tag but was created to specify sections in which the fields could be auto-completed when using a select input. For instance, in the Open Source Software form, selecting an already existing projet would fill its information, leaving the user to fill only the remaining part of selecting their administration and updating its uses.

This preset takes no additional parameters.

This preset does not appear in the schema.

#### Languages
The languages preset displays a list of check boxes allowing the user to select which programming languages are associated with the current projet. It also allows users to add their own if they can't find it in the list. It was created because it was different from the other components and widgets.

This preset takes no additional parameters.

#### Licenses
The licenses preset displays two fields for the license URLs (one for english and one for french) as well as a field for the spdxID of the license. The label for the spdxID contains a link to a list and definition of spdxIDs.

This preset takes no additional parameters.

#### newAdmin
The newAdmin preset has two roles. In the administration standalone form, it display all the required fields to create a new administration. In any other forms, it comes with the **adminCode** preset and is displayed only when the user click on the add a new administration button.

This preset contains five fields.
 - A select field for the organisation level (locked to municipal)
 - A field for the code of the new administration
 - A select field for the corresponding province of the municipality
 - A duo of fields for both english and french name of the new administration

This preset takes one *optional* parameter:
 - `optional`: Distinguish between the standalone version of the form, or the included hidden by default version that is added with the **adminCode** preset.
```yaml
---

id:  admin

formGroups:
  - preset:  newAdmin

# _data/forms/config-admin.yml
```
OR
```html
{%- include  form/presets/newAdmin.html  id=include.id  optional=true  -%}
<!-- _includes/form/presets/adminCode.html -->
```

#### orgLevel
The orgLevel preset displays a single select field with the different level of government (federal, provincial, municipal, etc.) with the "federal" and "provincial" value disabled since there can't be any new provinces of federal administrations.

This preset takes no additional parameters.

#### provinceSelect
The provinceSelect preset displays a single select field with the list of all provinces and territories of Canada.

This preset takes no additional parameters.

#### relatedCode
The relatedCode preset displays four fields:
 - The URLs (english and french) of the related code
 - The Names (english and french) of the related code

This preset takes no additional parameters.

#### schemaVersion
The schemaVersion preset displays a readonly field for the schema version, currently at "1.0".

This preset takes no additional parameters.

#### selectCode, selectOss and selectStandards
The selectCode, as well as selectOss and selectStandards presets allow the user to select an already existing project in order to edit it or add new linked elemens (releases, uses, administrations, etc.). Using JavaScript, the whole point of these presets are to fill the corresponding section of the form when selecting an existing project.

These do not show in the schema pages.

This follows a similar principle as the **adminCode** preset.

These presets take no additional parameters.

#### status
The status preset displays a select input with the possible project statuses (Alpha, Beta, Maintained, Deprecated or Retired).

This preset take no additional parameters.

#### submitter
The submitter preset shouldn't be added in the config files since it's already included in the form layout. See the section about the form layout for more informations.

#### tags
The tags preset display fields for adding tags to the current project. There is sections for both english and french as well as a button to add more than the first required tag.

### Widgets
Found under `_includes[form/schema]/widgets/`, widgets are generic components that takes more parameters but can be configured to fit simple section of a form.

Parameters
Don't forget to mention something about the title attribute and its link to translations
```yaml
---
  - widget: 'example'
    title: ~
    type: 'string'  # enum()
    rule: ~  # enum()
    required: true  # bool

```

The following sections explain each of the available widgets:
 - group
 - select
 - string-i18n
 - string

#### group
The group widget display a list of other widgets under a single title.

#### select
The select widget display a select input.

#### string-i18n
The string-i18n widget displays a duo of fields for a single value (in english and french).

#### string
The string widget displays a single field for values that are unique and don't need translating.

## Includes

### The loop
The loop does...

### Components
These are even more generic than widgets and were created solely for the purpose of less duplication of code.

## Translations
Test

A note on widget which are already done

How to translate widgets & include data in schema

## JavaScript
Test

### footer
Test