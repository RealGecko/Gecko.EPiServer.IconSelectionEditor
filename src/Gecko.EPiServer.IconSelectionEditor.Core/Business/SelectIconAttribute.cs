using EPiServer.Shell.ObjectEditing;
using System;
using System.Web.Mvc;

namespace Gecko.EPiServer.IconSelectionEditor.Core.Business
{
    public class SelectIconAttribute : Attribute, IMetadataAware
    {
        public void OnMetadataCreated(ModelMetadata metadata)
        {
            if (!(metadata is ExtendedMetadata extendedMetadata))
            {
                return;
            }

            extendedMetadata.ClientEditingClass = "gecko/IconSelectionEditor";
            extendedMetadata.EditorConfiguration.Add("SelectionGridWidth", SelectionGridWidth);
            extendedMetadata.EditorConfiguration.Add("IconsPerRow", IconsPerRow);
            extendedMetadata.SelectionFactoryType = SelectionFactoryType;
        }

        public virtual Type SelectionFactoryType { get; set; }

        public virtual string SelectionGridWidth { get; set; }

        public virtual int? IconsPerRow { get; set; }
    }
}