using System.Web;

namespace Gecko.EPiServer.IconSelectionEditor.Core.Business
{
    public abstract class IconSelectItem : IHtmlString
    {
        public string Id { get; set;  }
        
        public string Name { get; set; }

        public string HtmlString => ToHtmlString();

        public abstract string ToHtmlString();
    }
}