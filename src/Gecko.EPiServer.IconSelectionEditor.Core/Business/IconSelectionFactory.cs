using System.Collections.Generic;
using System.Linq;
using EPiServer.Shell.ObjectEditing;

namespace Gecko.EPiServer.IconSelectionEditor.Core.Business
{
    public abstract class IconSelectionFactory : IIconSelectionFactory
    {
        public IEnumerable<ISelectItem> GetSelections(ExtendedMetadata metadata)
        {
            return GetIcons(metadata).Select(x => new SelectItem { Text = x.Name, Value = x });
        }

        public abstract IEnumerable<IconSelectItem> GetIcons(ExtendedMetadata metadata);
    }
}