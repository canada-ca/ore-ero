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
> Every translation follows this template:
> ```yaml
> example:
>    en: English value
>    fr: French value
>    ```
>    So to call the translation for the "example" keyword, we would use the following: ``{{ example[page.lang] }}``. Using ``[page.lang]`` allows us to simplify content creation as we don't have to worry about about the current language for each individual page, and also enables us to freely use includes without having to create a duplicate for each languages since the page variables are applicable to all components included in said page.
 - `permalink`: The permalink for the page (at least the part that will be appended to the base URL of the website), will override the file location in the folders when the website is compiled. Follow the convention `/[lang]/[page name].html`.

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
The form pages require a few adjustments:
 - `layout`: Form pages use "form" as their layout value instead of the default one.
 - `config`: Refers to the name of the Yaml file in `_data/forms/` associated with the current form. That's how the relation is created between the current layout and the required data for the form.

**Header example for a form page**
```yaml
---
layout: form
ref: exampleForm
lang: en
permalink: /en/example-form.html
config: config-example # Will fetch _data/forms/config-example.yml
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
Each of the forms and schema pages pull from the same two layouts that acts as a template in which the data extracted from the config files will be added.

### Form layout
Found under `_layouts/form.html`, it inherits from the default layout as to include the header, footer and other fixed components of the website.

#### How it works
First, the content defined in the page using this layout is added using `{{ page.content }}`, as to include any page-specific content you wish to add to the it. Then comes the form.

The part of the form included in the layout has some classes and ids required for the form validation plugin (that comes with the [WET-BOEW](https://wet-boew.github.io/wet-boew/docs/ref/formvalid/formvalid-en.html) template), then we define the `idPresets` variable. This refers to the first-level group "presets" in the translation file and is declared here in order to be declared only once for the forms and avoid duplication of definition. Up next comes the piece de résistance, a `include` call to the form loop. That's where the template system looks for the values in the config file and includes the correct elements to the form.

Then the submitter file is included. The information about the submitter of the form (name and email) are required for the creation of the pull requests. Since we're currently using an anonymous bot to create all pull requests, these informations allow us to keep track of who submitted the changes.

Finally, the submit and reset buttons are added to the form. Note that the submit button has a unique id corresponding to `prbotSubmit{{ page.ref }}` where `{{ page.ref }}` translates to the value you added to `ref` in the header of the page. This will come up later in the JavaScript files when binding the submit event to the button. It was added to better distinguish between the different submit function calls and to prevent errors. Following the buttons are the different alerts the form uses, improving the user experience.

All these elements are located in the layout instead of the page or config file since they should all appear in the form page regardless of which form the page is referring to.

### Schema layout
Found under `_layouts/schema.html`, it inherits from the default layout as to include the header, footer and other fixed components of the website.

#### How it works
First, the content defined in the page using this layout is added using `{{ page.content }}`, as to include any page-specific content you wish to add to it. Then the loop for the schema is included. Nothing else is added to the schema pages.

## Config files
These files are the backbone of this solution. They specify each components and their parameters that must be included in the form and schema associated with each one of them.

**Here's an example file with default values:**

 - `~` represents an undefined default value
 - Every value is a string, unless specified otherwise using comments
	 - `# enum()` means that there are specific values for this field, and other values will result in errors
 - The list for every available presets and widgets are specified later
	 - Certain presets and most widgets have their own specific parameters and are explained later in their corresponding section
```yaml
---

id: example

formGroups:
  - preset: ~  # enum()
  - widget: ~  # enum()
    title: ~
    type: text
    rule: ~  # enum()
    required: true  # bool

```

### Presets
Found under `_includes/[form/schema]/presets/`, presets are a set of (mostly) static sections that rarely take in parameters and should be used as is. Each preset was created for either of two purposes. The first is for when a section is called from two or more forms and it made more sense to have it predefined instead of having to  specify the same parameters to a widget twice. The second is when the section is too specific or doesn't fit in any of the widgets, either because it has some minor changes that would have been too specific to add as a parameter, or when the format is completely different from any widgets.

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
The adminCode preset displays a `<select>` widget for administrations separated in groups for each level of government (federal, provincial, municipal, etc.). See the list of administrations in `_data/administrations/[level of gov.].yml`.

The select widget is followed by a button that allows users to create a new administration, should they not find theirs in the list. The button opens a new section in the form containing the required fields for the creation of a new administration. For more informations on these fields, consult the **newAdmin** preset section.

When selecting the appropriate administration (depending on the type of the form) JavaScript should be added to auto-fill the administration section of the form. This follows the same logic as for the **selectCode**, **selectOss**, and **selectStandards** presets.

This preset takes no additional parameters.
```yaml
  - preset: adminCode
```

#### contact
The contact preset displays a group of fields for the contact information (URL, email, name, phone) for the person or organization responsible of the open source element this form refers to.

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

Also, to simplify the code you write, you can simply omit any value you don't want shown and specify to true only the value you want to display.
```yaml
  - preset: dates
    created: true
    modified: true
```

#### description
The description preset displays two fields, one for the english and the other for the french description of the current projet. This preset was created because at least two of the forms made use of a description field.

This preset takes no additional parameters.
```yaml
  - preset: description
```

#### empty
The empty preset does not display anything in the form, but rather serves as an [array] wrapper in the schema when there is a list of elements that are only updated as individual elements in the form. For instance, for the "release" array of the code schema (`_data/schemaCode.yaml`), it makes no sense to change the layout of the form to adapt to an array since only one release can be updated at a time. However, this should still be displayed as an array in the schema page.

This preset takes two **required** parameters:
 - `start` defines if this is the start or the end of the array element in the schema (decides to add either the 
beginning or the ending html markup).
- `title` the name of the array element in the schema (also used for the translations, see the widget section for more informations about title parameters)
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
The beginning and the ending markup are located under `_includes/schema/components/wrap_start.html` and `_includes/schema/components/wrap_end.html`. These are the files that are included in the schema pages.

#### homepageUrl
The homepageUrl preset displays a duo of fields, one for the english and the other for the french homepage URL of the current project. This preset was created because at least two of the forms made use of a homepage URL.

This preset takes no additional parameters.
```yaml
  - preset: homepageUrl
```

#### hr
The hr preset is a simple `<hr>` tag but was created to specify sections in which the fields could be auto-completed when using a select input. For instance, in the Open Source Software form, selecting an already existing projet would fill its information, leaving the user to fill only the remaining part of selecting their administration and updating its uses.

This preset takes no additional parameters.
```
  - preset: hr
```

This preset does not appear in the schema.

#### Languages
The languages preset displays a list of check boxes allowing the user to select which programming languages are associated with the current projet. It also allows users to add their own if they can't find it in the list. It was created because its html markup differed from the other components and widgets.

This preset takes no additional parameters.
```yaml
  - preset: languages
```

#### Licenses
The licenses preset displays two fields for the license URLs (one for english and one for french) as well as a field for the spdxID of the license. The label for the spdxID contains a link to a list and definition of spdxIDs.

This preset takes no additional parameters.
```yaml
  - preset: licenses
```

#### newAdmin
The newAdmin preset has two roles. In the administration standalone form, it displays all the required fields to create a new administration. In any other forms, it comes with the **adminCode** preset and is shown only when the user click on the "add a new administration" button.

This preset contains five fields.
 - A select field for the organisation level (locked to municipal)
 - A field for the code of the new administration
 - A select field for the corresponding province of the municipality
 - Two fields for both the english and french name of the new administration

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
The orgLevel preset displays a single `<select>` widget with the different level of government (federal, provincial, municipal, etc.) with the "federal" and "provincial" value disabled since there can't be any new provinces of federal administrations.

This preset takes no additional parameters.
```yaml
  - preset: orgLevel
```

#### provinceSelect
The provinceSelect preset displays a single `<select>` widget with the list of all provinces and territories of Canada.

This preset takes no additional parameters.
```yaml
  - preset: provinceSelect
```

#### relatedCode
The relatedCode preset displays four fields:
 - The URLs (english and french) of the related code
 - The Names (english and french) of the related code

This preset takes no additional parameters.
```yaml
  - preset: relatedCode
```

#### schemaVersion
The schemaVersion preset displays a readonly field for the schema version, currently at "1.0". It should be added to each form.

This preset takes no additional parameters.
```yaml
  - preset: schemaVersion
```

#### selectCode, selectOss and selectStandards
The selectCode, as well as selectOss and selectStandards presets display a `<select>` widget allowing the user to select an already existing project in order to edit it or add new linked element (releases, uses, administrations, etc.). Using JavaScript, the whole point of these presets are to auto-fill the corresponding section of the form when selecting an existing project.

These do not show in the schema pages since their only use is to allow an auto-fill feature.

This follows a similar principle as the **adminCode** preset.

These presets take no additional parameters.
```yaml
  - preset: selectCode
```

#### status
The status preset displays a `<select>` input with the possible project statuses (Alpha, Beta, Maintained, Deprecated or Retired). It was created since at least two or more form used it.

This preset takes no additional parameters.
```yaml
  - preset: status
```

#### submitter
The submitter preset displays a separated section of the form inquiring the user abouts its informations (name, email) in order to keep track of who submitted the form.

The submitter preset shouldn't be added in the config files since it's already included in the form layout. See the section about the form layout for more informations.

#### tags
The tags preset display fields for adding tags to the current project. There is sections for both english and french as well as a button to add more than the first required tag.

This preset takes no additional parameters.
```yaml
  - preset: tags
```

### Creating a new preset
Here are explained the different steps to create a new preset. But first, make sure the creation of this new preset is really necessary. As explained in the presets description, they should be created only on two occasions. The first occasion is when a certain form component appears on more than one form, in this case it is acceptable to create a new preset, since it reduce the duplication of code. The second occasion is when a certain form component does not follow the simple markup of any of the other widgets. However, It would still be a good idea to reflect on if this new structure or markup will appear more than once, then it might be beneficial to create a more generic widget instead.

#### Add your new preset in the form components
Under `_includes/form/presets/` create a file for your new preset. Its name should follow camelCase convention. Fill it with html markup, you should use inspiration from other presets, and don't be afraid to simply include widgets in it using specific parameters, that's how most presets work when they are used in more than one form.

Then, add a call to your new preset in the form loop (`_includes/form/loop.html`) under `{%- case formGroup.preset -%}`, follow an alphabetical order to simplify search and match the display in the folders. In the following example, change `[preset]` for the name of your new preset:
```html
{%- if formGroup.preset -%}
  {%- case formGroup.prese  -%}
    {%- when '[preset]' -%}
      {%- include form/presets/[preset].html id=idPreset [parameter=formGroup.value] -%}
```
Keep the `id=idPreset` parameter and value intact since they will be used for the translations. remove `[parameter=formGroup.]` if you don't need to specify other parameters (this should be the case a majority of the time), or replace it with your own custom parameter, where `value` has the same value as what you will add in the config file, and for the sake of consistency, `parameter` should also match `value`.  What `formGroup` is simply the name given of each iterated element in the loop (`for formGroup in formGroups`) For example:
```html
{%- when 'example' -%}
  {%- include form/presets/example.html id=idPreset test=formGroup.test -%}
```
AND
```yaml
  - preset: example
    test: myValue
```
The value for `test` can then be accessed in your preset as `include.test`.

> Include is the keyword used to access parameters declared in any files under the `_includes/` folder, the same is true for `page.test` in `_pages/`. Data is a bit different as it required first a call to site `site.data.test` where "test" can be a file or a folder in `_data/`.

#### Add your new preset in the schema components
Under `_includes/schema/presets/`, create a file for your new preset. Its name should match the one you previously created in the form folder. Follow the same advice for the form to fill it.

Then, add it to the schema loop (`_includes/schema/loop.html`) using the same indications as for the form.

Unless your preset has a different behaviour between the form and the schema (like the empty, hr or selectCode presets), you should always create the preset file in both the form and schema folders. If your preset doesn't have the same behaviour, still add its case `{%- when  'example'  -%}` to both loops but simply keep the case content empty. That way, you will avoid throwing errors.

### Widgets
Found under `_includes/[form/schema]/widgets/`, widgets are generic components that takes more parameters and thus can be configured to fit different sections of a form.

Example Widget with default values
```yaml
  - widget: example # enum()
    title: ~
    type: text # enum()
    rule: ~  # enum()
    required: true  # bool
```

 - `widget`: specifies which widget to include. This parameter is **required** otherwise the form will display an error message.
 - `title`: The title of the widget. Must be a unique id (with exceptions, see the group widget). Also used for translations. This parameter is **required** otherwise the widget won't display any text. Its value should be the same as the corresponding element in the schema since its used as is in the schema page template (more about this in the translation section.
> The title parameters corresponds to the id used in the translation file (`_data/i18n/form.yml`) as a second-level element under the first-level element corresponding to the id of the form declared at the beginning of the config file.
> ```yaml
> example:  # The id of the form
>   title:  # The title of the widget
>       [...]
>   ```
>   More on translations can be found in the translations section.
 - `type`: Defines the type of the input, available values are the appropriate values for an html input tag (text, URL, email, etc.) included in a way similar as `<input type="{{ widget.type }}">`. This widget is *optional* and defaults to "text", specify it only if you wish to have a different type.
 - `rule`: Specifies a custom rule of validation. Available rules can be found in `_data/forms/rules.yml`, you can use any of the key (`key: value`) you find in this document as a value for the rule parameter. This parameter is *optional* and default to none.
> The custom rules allows different types of validation that allows or forbid different characters in the fiels. See `assets/js/src/custom-form-validation.js` to see the full list of rules and their accepted characters.
- `required`: Specifies if the field(s) in the widget are required or not. This field is *optional* since all fields are required by default. Specify this parameter only when you wish to indicate that a widget should not be required.

The following sections explain each of the available widgets:
 - group
 - select
 - string-i18n
 - string

#### group
The group widget display a list of other widgets under a single title.

This widget takes one additional parameter in addition to the ones available to widgets.
 - `fields`: An array of widgets and their own parameters to display in the same logical group.
```yaml
  - widget: group
    title: example
    fields:
      - widget: string
        title: test1
      - widget: string-i18n
        title: test2
      [...]
```
The widgets declaration under fields acts the same way as if they were declared as top-level fieldGroups.

Also, if you add the required parameter to the group widget, it will applies to all children widgets, unless you specify it at the child level. The following example shows how the required parameter can be used:
```yaml
  - widget: group
    title: example
    required: false
    fields:
      - widget: string
        title: test1
        required: true
      - widget: string-i18n
        title: test2
```
In this example, the `required: false` of the parent `group` overwrite the default required value of all its children widgets, so in this example, the `string-i18n` widget would be not required. However in the case of the `string` widget, since we specify it directly, it would still be required. The following example shows another way the required parameter can be used:
```yaml
  - widget: group
    title: example
    fields:
      - widget: string
        title: test1
        required: false
      - widget: string-i18n
        title: test2
```
In this example, since the required parameter is not specified on the `group` level, all children widgets are still required by default. However, specifying the required parameter on a child has the same behaviour as usual, meaning that, in this case, the `string` child widget, and only this one, would not be required.

It is not possible to add presets to group widgets.

#### select
The select widget was created in order to have a more generic version of a `<select>` tag, but all the widgets using it were later transformed in presets as we discovered they were used in more than one form. It's not used at all at the time of writing this, but since it's already build, I decided to keep it in.

This widget takes one additional parameter in addition to the ones available to widgets.
 - `options`: a list of the options available as an array.
```yaml
  - widget: select
    title: example
    options: [a, b, c]
```
The values in the options in the array will be the ones used in the value attribute of the option tag (`<option value="{{ option[i] }}"`). These options are also the keys used for the translations. More about it in the translation section.

#### string-i18n
The string-i18n widget displays two fields for a single value (in english and french).

This widget takes all the parameters available to widgets.
```yaml
  - widget: string-i18n
    title: example
```
This widget also takes one additional parameter that was added to fix a duplicate id error in the html markup.
 - `prepend`: A string to prepend to the id when generating the html markup. It allows to keep the title parameter clear (since it's used in the schema as well as for translations) without creating conflicts in ids. It feels like a cheat, and thus should be used wisely.

#### string
The string widget displays a single field for values that are unique and don't need translating.

This widget takes all the parameters available to widgets.
```yaml
  - widget: string
    title: example
```

### Creating a new Widget
Creating a widget is similar to creating a preset, but follows a more generic idea. Create a new widget when multiple form components follow the same basic and simple structure. A widget shouldn't be complex and should allow for more variations than presets.

#### Add your new widget in the form components
Under `_includes/form/widgets/` create a file for your new preset. Its name should follow camelCase convention. Fill it with html markup, use inspiration from other widgets, and if you can include components in it instead of adding new code.

Then, add a call to your new preset in the form loop (`_includes/form/loop.html`) under `{%- case formGroup.widget -%}`, follow an alphabetical order to simplify search and match the display in the folders. In the following example, change `[preset]` for the name of your new preset:
```html
{%- else -%}
  {%- case formGroup.widget -%}
    {%- when '[example]' -%}
      {%- include form/widgets/[example].html id=id title=formGroup.title type=formGroup.type rule=formGroup.rule required=formGroup.required [parameter=formGroup.value] -%}
```
*Don't forget to add the default widget parameters.*

Remove `[parameter=formGroup.value]` if you don't need to specify other parameters, or replace it with your own custom parameters, where `value` has the same value as what you will add in the config file, and for the sake of consistency, `parameter` should also match `value`.  what `formGroup` is simply the name given of each iterated element in the loop (`for formGroup in formGroups`) For example:
```html
{%- when  'example'  -%}
  {%- include form/presets/example.html [default parameters] test=formGroup.test -%}
```
AND
```yaml
  - widget: example
    test: myValue
```
The value for `test` can then be accessed in your preset as `include.test`.

> Include is the keyword used to access parameters declared in any files under the `_includes/` folder, the same is true for `page.test` in `_pages/`. Data is a bit different as it required first a call to site `site.data.test` where "test" can be a file or a folder in `_data/`.

#### Add your new widget in the schema components
Under `_includes/schema/widgets/`, create a file for your new preset. Its name should match the one you previously created in the form folder. Follow the same advice for the form to fill it.

Then, add it to the schema loop (`_includes/schema/loop.html`) using the same indications as for the form.

Unless your preset has a different behaviour between the form and the schema (like the empty, hr or selectCode presets), you should always create the preset file in both the form and schema folders. If your preset doesn't have the same behaviour, still add its case `{%- when 'example' -%}` to both loops but simply keep the case content empty. That way, you  will avoid throwing errors.

## Includes

### The loop
Both loops acts in the same way. Basically, for each elements in the `formGroups` array in the config file, it checks if the current element is a preset or a widget, then there's a switch case for each where we check which type of preset or widget then includes the correct file and pass it parameters either from the config file or directly in the include call.

The for loop goes like this: `{%- for formGroup in site.data.forms[page.config].formGroups -%}`, its a simple for loop, but I wanted to explain the "in" part. It's a liquid call that translates into a link to a file; `site.data` is equivalent to requiring the `_data/` folder. Then forms is also a calls to the `forms` folder under data. Thus far, it links to `_data/forms/`. The next call is `[page.config]`. This relates to the page parameter added to the page header
```yaml
---
[...]
config: config-example
```
So `[page.config]` translates to, in this case, `config-example`, which will concatenate to `_data/forms/config-example.yml`. You can basically mix folders and files at the same time. But also, you can mix in parameters from inside files, which `formGroups` is. So in total, it gets to: the `formGroup` parameter in `_data/forms/config-example.yml`.

### Components
Here be dragons. Components are even more generic than widgets and were created solely for the purpose of less duplication of code. But in order to make it simple, it became a bit complicated underneath, and if you don't need to debug, you can skip this section and go directly to translations.

## Translations
The translations for the forms and schema are located in `_data/i18n/form.yml` and are separated in sections for more generic translations as well as first-level groups for each of the forms. 

#### Yaml Variables
As a useful note, it is possible to create variables in Yaml files. Use `&variable` for instanciation and `*variable` for using. In this particular case, it's used to declare and use generic values (name, email, URL, etc.). But the neat thing is that it can act as a string or as an object, so we can easily wrap translations inside a single variable. Here's an example of what it looks like in the files:
```yaml
name: &name
  en: Name
  fr: Nom
[...]
example:
  label: *name
```
Is the equivalent of:
```yaml
example:
  label:
    en: Name
    fr: Nom
```
But allows us not to have duplicate translations.

### Presets
All the presets translations are already included and should you modify any of the presets files (`_includes/[form/schema]/presets/`), you should also verify the translations.

If you create a new preset, you must add it under the presets first-level group, unless you specified a different parameter in the loop (`includes/[form/schema]/loop.html`).
 - In general, the preset includes specifies "presets" as an id: `{% include file.yml id=idPreset %}`
 - However, you can use `id` instead of `idPreset` to use the id defined in the config page. This will mean that you must put the translations under the equivalent first-level element named after the `id` instead of "preset".

### Translations for Widgets
Here's how to translate each widget:
 - For each widget, add a second-level element (under the first-level named after `id`) and name it as the value you put under `title` in the config file. The title should be the same as the value in the schema page as it is included as is in the schema page.
```yaml
first-level:  # either preset, admin, code, oss, standard, etc...
  example:  # replace example with the title value of the widget
    [...]
```
 - You will also need to, bear with me it might be confusing, add a title element under it. Don't confuse it with the second-level element, where title should be replaced with the title value of the current widget. This title is a third-level element named title which will hold the english and french value for the title. This value appears in the form page as a section's title and as the section description in the schema page:
```yaml
first-level:
  example:
    title:
      en: Example
      fr: Exemple
```
 - Each widget also have other specific elements that need to be added and are described in their specific sections below

#### String Widget
For a string widget, follow this template:
```yaml
first-level:
  example:
    title:
      en: Example
      fr: Exemple
    label:
      en: The english label
      fr: The french label
```

#### String-i18n Widget
For a string-i18n widget, follow this template:
```yaml
first-level:
  example:
    title:
      en: Example
      fr: Exemple
    labels:
      en:
        en: The english label for the english page
        fr: The french label for the english page
      fr:
        en: The english label for the french page
        fr: The french label for the french page
      schema:
        en: The generic english label for the schema (without specificity for either english of french)
        fr: The generic french label for the schema (without specificity for either english of french)
```

#### Select
For a select widget, follow this template:
```yaml
first-level:
    example:
      title:
        en: Example
        fr: Exemple
      options:
        option-name:  # where option-name is the value added in the options array in the config file
          en: Option
          fr: Option
        [...]
```
#### Group
For a group widget, the values under `labels` depends on the fields' widget type, follow this template:
```yaml
first-level:
  title:
    en: Example
    fr: Exemple
  labels:
    string:  # replace string with the title of a string widget
      en: The english value for the label
      fr: The french value for the label
    string-i18n:  # replace string-i18n with the title of a string-i18n widget
      en:
        en: The english value for the english page
        fr: Then french value for the english page
      fr:
        en: The english value for the french page
        fr: The french value for the french page
  titles:
    widget-name:  # replace widget-name with each widget names
      # The title is used for the schema page
      en: Widget Name
      fr: Nom du widget
    [...]
```

## JavaScript
Each form needs its own custom JavaScript to submit that you need to create.

All the scripts are located under `assets/js/src/`. The scripts for each forms follow the naming convention `[form id]Form.js` with camelCase. There are other scripts that fall under the utility category which are `programmingLanguages.js` for adding and removing custom programming languages in the preset of the same name, and the `tags.js` for adding and removing tags in the tags preset.

### Footer links
The link to the scripts are added in the footer which is located in `_includes/footer.html`.

At the very bottom is a inline script declaring some constants that are used in other scripts files. They are `REPO_NAME`, `USERNAME`, and `PRBOT_URL` and their values are taken from the `_config.yml` and pulled through Jekyll/Liquid. Just before is where are added the scripts for the forms. Next up, we add the script only on its particular form page with a simple `if` using the page `ref` (declared in the page header).

### PRB0T
[PRB0T](https://github.com/PRB0t/PRB0t) is an open source solution we [forked](https://github.com/j-rewerts/PRB0t) and customized to fit our specific needs. It's what we use with the form to submit changes. What's actually going on is that we merge the necessary files with the new content pulled from the form, and then we submit a pull request in the Gitub repo.

### Javascript files
At the beginning of the file is a comment that tells eslint that the function does exists and its just located in another file, so it won't throw errors and fail the build.

Next below are usually declared two javascript objects constants. Since they're used all through the file, it made sense to declare it only once at the top.

Then is the jQuery equivalent of `document.ready` in which we add the function binding between the different selects for auto-fill, the submit and reset for the form.

#### Submit
When submitting the form, we first validate the form and initiate the alerts and continue only if validated using the `submitInit()` function from the `validation.js`. Then if there is a new admin button, we check if the admin form is filled and then call either the submit function with or without the new administration.

#### Reset
Some form require a specific function for reset, especially when dealing with tags and programming languages since the user can add or remove tag fields and we want to make sure to reset those as well since the basic reset does not take care of that by default.

#### getObject
The `get[form id]Object()` method is the function that takes all the values from the form inputs and process them in an object that follows the hierarchy as the schema for the form. It is separated in two sections. Firstly, all the mandatory fields are added to the object, then it probe each single non-mandatory field, check if it has a value, and add it to the object if it does. The non-mandatory part was separated since we don't want to add keys with empty values to the data files.

#### addValuesToFields / resetFields
When pulling data from github (when the user select an already existing project or administration), this method fill the fetched data in the inputs. The reset field does just the opposite, if the suer choose to change the select back to its default null value, we need to remove the values we added to the fields, but not necessarily for all the fields in the form since they can be separated in sections (i.e. selecting an existing software or administration in the software form do not change the same fields and reseting one does not mean the other also need reseting).

