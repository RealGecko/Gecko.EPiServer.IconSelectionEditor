using EPiServer.Shell.ObjectEditing;
using System.Collections.Generic;

namespace Gecko.EPiServer.IconSelectionEditor.Core.Business
{
    public interface IIconSelectionFactory : ISelectionFactory
    {
        IEnumerable<IconSelectItem> GetIcons(ExtendedMetadata metadata);
    }
}
