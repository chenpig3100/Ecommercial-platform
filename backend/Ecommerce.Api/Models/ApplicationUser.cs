using Microsoft.AspNetCore.Identity;

namespace Ecommerce.Api.Models
{
    public class ApplicationUser : IdentityUser
    {
        public ICollection<Product> Products { get; set; } = new List<Product>();
        public Cart? Cart { get; set; }
        public ICollection<Order> Orders { get; set; } = new List<Order>();
    }
}
