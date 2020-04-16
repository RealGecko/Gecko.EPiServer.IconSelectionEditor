[![Platform](https://img.shields.io/badge/Episerver-11.1.0-orange.svg?style=flat)](https://nuget.episerver.com/package/?id=EPiServer.CMS.UI.Core&v=11.1.0)

# Icon Selection Editor for EPiServer.

Module which extends EPiServer edit mode by adding possibility to select icons (i.e. [Font Awesome](https://fontawesome.com/), [Materialize](https://materializecss.com/), [CSS.gg](https://css.gg/) etc.) using dropdown.

![](docs/fa.gif)

## How to create and use IconSelectionEditor.

1. Create model class which will represent icon:
```csharp
public class CustomIconSelectItem : IconSelectItem
{
    public override string ToHtmlString()
    {
        (...)
    }
}
```

2. Create IconSelectionFactory which will return all available icons:
```csharp
public class CustomIconSelectionFactory : IconSelectionFactory
{
    public override IEnumerable<IconSelectItem> GetIcons(ExtendedMetadata metadata)
    {
        (...)
    }
}
```

3. Create property attribute:
```csharp
public class SelectCustomIconAttribute : SelectIconAttribute
{
    public SelectCustomIconAttribute()
    {
        this.SelectionFactoryType = typeof(CustomIconSelectionFactory);
        this.SelectionGridWidth = "580px";
    }
}
```

4. Decorate EPiServer content model property using created custom attribute:
```csharp
[ContentType(DisplayName = "Custom Content Block", GUID = "d1216b39-21ce-4873-a8c1-c3d5db2b9285")]
public class CustomContentBlock : BlockData
{
    [SelectCustomIcon]
    public virtual string Icon { get; set; }
}
```